#!/usr/bin/env python3
"""
Синхронизация офлайн-конверсий Bitrix24 → Яндекс.Метрика
Запускается ежедневно утром. Загружает все визиты за вчерашний день.
"""
import os, csv, io, time, datetime, requests

BITRIX_WEBHOOK = os.environ['BITRIX_WEBHOOK']
YA_TOKEN       = os.environ['YA_METRIKA_TOKEN']
COUNTER_ID     = 107225079

MASTER_EVENTS = {
    'Марк':       'visit_mark',
    'Арина':      'visit_arina',
    'Егор':       'visit_egor',
    'Владислав':  'visit_vladislav',
    'Евгения':    'visit_evgeniya',
    'Павел':      'visit_pavel',
    'Константин': 'visit_konstantin',
    'Антон':      'visit_anton',
    'Наталья':    'visit_natalya',
    'Дмитрий':    'visit_dmitriy',
    'Степан':     'visit_stepan',
    'Вера':       'visit_vera',
    'Софья':      'visit_sofya',
    'Николай':    'visit_nikolay',
}


def bitrix_get_all(method, params):
    results, start = [], 0
    while True:
        params['start'] = start
        r = requests.post(f"{BITRIX_WEBHOOK}/{method}", json=params, timeout=30)
        batch = r.json().get('result', [])
        results.extend(batch)
        total = r.json().get('total', 0)
        if len(results) >= total or not batch:
            break
        start += 50
        time.sleep(0.2)
    return results


def get_deals_for_date(date_str):
    """Все завершённые сделки за указанную дату"""
    next_day = (datetime.date.fromisoformat(date_str) + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    return bitrix_get_all('crm.deal.list', {
        'select': ['CONTACT_ID', 'UF_CRM_X3_STAFF_NAME', 'CLOSEDATE'],
        'filter': {
            '>=CLOSEDATE': date_str,
            '<CLOSEDATE':  next_day,
            '!UF_CRM_X3_STAFF_NAME': '',
            '!CONTACT_ID': '',
        }
    })


def get_contacts_phones(contact_ids):
    result = {}
    ids = list(set(str(i) for i in contact_ids if i))
    for i in range(0, len(ids), 50):
        chunk = ids[i:i+50]
        contacts = bitrix_get_all('crm.contact.list', {
            'select': ['ID', 'PHONE'],
            'filter': {'ID': chunk}
        })
        for c in contacts:
            phones = [p['VALUE'] for p in (c.get('PHONE') or []) if p.get('VALUE')]
            if phones:
                result[str(c['ID'])] = phones[0]
        time.sleep(0.1)
    return result


def normalize_phone(phone):
    digits = ''.join(c for c in phone if c.isdigit())
    if digits.startswith('8') and len(digits) == 11:
        digits = '7' + digits[1:]
    if len(digits) == 10:
        digits = '7' + digits
    return digits if len(digits) == 11 else None


def date_to_unix(date_str):
    """2026-03-19 → unix timestamp (полдень МСК)"""
    dt = datetime.datetime.fromisoformat(f'{date_str}T12:00:00')
    return int(dt.timestamp())


def upload_to_metrika(rows):
    """
    rows: list of (client_id, event_key, unix_ts)
    client_id = телефон (используем как суррогатный идентификатор)
    """
    if not rows:
        print('  Нет данных')
        return

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(['ClientId', 'Target', 'DateTime'])
    for client_id, event_key, ts in rows:
        writer.writerow([client_id, event_key, ts])
        writer.writerow([client_id, 'visit_any', ts])  # общая цель

    r = requests.post(
        f'https://api-metrika.yandex.net/management/v1/counter/{COUNTER_ID}/offline_conversions/upload',
        headers={'Authorization': f'OAuth {YA_TOKEN}'},
        params={'client_id_type': 'CLIENT_ID'},
        files={'file': ('conversions.csv', buf.getvalue().encode('utf-8'), 'text/csv')},
        timeout=60
    )
    if r.status_code == 200:
        info = r.json().get('uploading', {})
        print(f"  ✓ Загружено: {info.get('line_quantity', '?')} строк, ID загрузки: {info.get('id')}")
    else:
        print(f'  ✗ Ошибка {r.status_code}: {r.text[:300]}')


def main():
    # По умолчанию — вчера. Можно передать дату аргументом: python sync_metrika.py 2026-03-19
    import sys
    if len(sys.argv) > 1:
        target_date = sys.argv[1]
    else:
        target_date = (datetime.date.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')

    print(f'=== Офлайн-конверсии за {target_date} → Метрика (счётчик {COUNTER_ID}) ===')

    print('\n1. Загружаем визиты из Bitrix...')
    deals = get_deals_for_date(target_date)
    print(f'   Сделок: {len(deals)}')
    if not deals:
        print('   Нет данных — выходим')
        return

    print('\n2. Телефоны контактов...')
    contact_ids = [d['CONTACT_ID'] for d in deals if d.get('CONTACT_ID')]
    phones_map = get_contacts_phones(contact_ids)
    print(f'   Найдено: {len(phones_map)}')

    print('\n3. Формируем строки...')
    rows, skipped = [], 0
    ts = date_to_unix(target_date)

    for deal in deals:
        cid = str(deal.get('CONTACT_ID', ''))
        staff = deal.get('UF_CRM_X3_STAFF_NAME', '').strip()
        phone_raw = phones_map.get(cid)

        if not phone_raw:
            skipped += 1
            continue

        phone = normalize_phone(phone_raw)
        if not phone:
            skipped += 1
            continue

        master_key = staff.split()[0]
        event_key = MASTER_EVENTS.get(master_key)
        if not event_key:
            skipped += 1
            continue

        rows.append((phone, event_key, ts))

    print(f'   Строк: {len(rows)}, пропущено: {skipped}')

    from collections import Counter
    for ev, cnt in sorted(Counter(r[1] for r in rows).items()):
        print(f'   {ev}: {cnt}')

    print('\n4. Загружаем в Метрику...')
    upload_to_metrika(rows)
    print('\n=== Готово ===')


if __name__ == '__main__':
    main()
