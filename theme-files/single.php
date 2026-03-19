<?php get_header(); ?>

<?php
$has_thumb = has_post_thumbnail();
$cats = get_the_category();
$cat_slug = $cats ? $cats[0]->slug : '';
$author_id = get_the_author_meta('ID');
$author_name = get_the_author_meta('display_name');
$author_bio = get_the_author_meta('description');
$author_avatar = get_avatar_url($author_id, ['size' => 64]);

$cta_map = [
  'sport'           => ['Готовитесь к забегу?', 'Спортмассаж снижает риск травм', 'Записаться →', 'https://rehabyou.site/massage/sport/?utm_source=blog&utm_medium=sticky&utm_campaign=sport'],
  'krasota'         => ['Уход — это не только снаружи.', 'Массаж как часть бьюти-рутины', 'Записаться →', 'https://rehabyou.site/massage/relax/?utm_source=blog&utm_medium=sticky&utm_campaign=beauty'],
  'materinstvo'     => ['Восстановление после родов.', 'Деликатный массаж вернёт ресурс', 'Записаться →', 'https://rehabyou.site/?utm_source=blog&utm_medium=sticky&utm_campaign=maternity'],
  'telo-i-zdorovye' => ['Тело накопило напряжение.', 'Один сеанс — и оно уходит', 'Записаться →', 'https://rehabyou.site/massage/classic/?utm_source=blog&utm_medium=sticky&utm_campaign=health'],
  'moskva'          => ['Москва выматывает.', 'Массаж рядом — два клуба в центре', 'Записаться →', 'https://rehabyou.site/?utm_source=blog&utm_medium=sticky&utm_campaign=moscow'],
  'sobytiya'        => ['Тело держит усталость.', 'Расслабляющий массаж за один сеанс', 'Записаться →', 'https://rehabyou.site/?utm_source=blog&utm_medium=sticky&utm_campaign=events'],
];
$cta = $cta_map[$cat_slug] ?? ['Тело скажет спасибо.', 'Два клуба в Москве, запись онлайн', 'Записаться →', 'https://rehabyou.site/?utm_source=blog&utm_medium=sticky&utm_campaign=general'];
?>

<?php if($has_thumb): ?>
<div class="single-hero" id="singleHero">
  <div class="single-hero-bg" id="singleHeroBg"><?php the_post_thumbnail('full'); ?></div>
  <div class="single-hero-overlay"></div>
  <div class="single-hero-content">
    <div class="single-hero-inner">
      <?php if($cats): ?>
      <div class="post-cat"><a href="<?php echo get_category_link($cats[0]->term_id); ?>"><?php echo esc_html($cats[0]->name); ?></a></div>
      <?php endif; ?>
      <h1><?php the_title(); ?></h1>
    </div>
  </div>
</div>
<?php else: ?>
<div class="single-header-plain">
  <div class="single-header-inner">
    <?php if($cats): ?>
    <div class="post-cat"><a href="<?php echo get_category_link($cats[0]->term_id); ?>"><?php echo esc_html($cats[0]->name); ?></a></div>
    <?php endif; ?>
    <h1><?php the_title(); ?></h1>
  </div>
</div>
<?php endif; ?>

<div class="single-byline">
  <div class="single-byline-inner">
    <img src="<?php echo esc_url($author_avatar); ?>" alt="" class="byline-avatar">
    <span class="byline-name"><?php echo esc_html($author_name); ?></span>
    <span class="byline-sep">·</span>
    <span class="byline-date"><?php echo get_the_date('d F Y'); ?></span>
  </div>
</div>

<!-- Умная плашка — только мобилка, сессионная, с крестиком -->
<div class="smart-bar" id="smartBar">
  <div class="smart-bar-content">
    <div class="smart-bar-text">
      <div class="smart-bar-title"><?php echo esc_html($cta[0]); ?></div>
      <div class="smart-bar-sub"><?php echo esc_html($cta[1]); ?></div>
    </div>
    <a href="<?php echo esc_url($cta[3]); ?>" target="_blank" rel="noopener" class="smart-bar-btn"><?php echo esc_html($cta[2]); ?></a>
  </div>
  <button class="smart-bar-close" id="smartBarClose" aria-label="Закрыть">×</button>
</div>

<div class="single-article">
  <div class="single-wrap">
    <div class="entry-content">
      <?php the_content(); ?>

      <?php if($author_bio): ?>
      <div class="author-card">
        <img src="<?php echo esc_url($author_avatar); ?>" alt="<?php echo esc_attr($author_name); ?>" class="author-card-avatar">
        <div class="author-card-info">
          <div class="author-card-label">Автор</div>
          <div class="author-card-name"><?php echo esc_html($author_name); ?></div>
          <div class="author-card-bio"><?php echo esc_html($author_bio); ?></div>
        </div>
      </div>
      <?php endif; ?>

      <div class="post-cta-block">
        <div>
          <div class="eyebrow">Rehab.You · Москва</div>
          <strong><?php echo esc_html($cta[0]); ?></strong>
          <p><?php echo esc_html($cta[1]); ?></p>
        </div>
        <a href="<?php echo esc_url(str_replace('sticky', 'article', $cta[3])); ?>" target="_blank" rel="noopener" class="cta-link"><?php echo esc_html($cta[2]); ?></a>
      </div>
    </div>
    <?php get_sidebar(); ?>
  </div>

  <?php
  $cat_ids = wp_get_post_categories(get_the_ID());
  $rel = new WP_Query(['category__in'=>$cat_ids,'post__not_in'=>[get_the_ID()],'posts_per_page'=>3,'orderby'=>'rand']);
  if($rel->have_posts()): ?>
  <div class="related-posts">
    <div class="related-title">Читайте также</div>
    <div class="related-grid">
      <?php while($rel->have_posts()): $rel->the_post(); ?>
      <a href="<?php the_permalink(); ?>" class="related-card">
        <?php if(has_post_thumbnail()): ?><div class="related-card-img"><?php the_post_thumbnail('medium'); ?></div><?php endif; ?>
        <div class="related-card-cat"><?php $rc=get_the_category(); if($rc) echo esc_html($rc[0]->name); ?></div>
        <div class="related-card-title"><?php the_title(); ?></div>
      </a>
      <?php endwhile; wp_reset_postdata(); ?>
    </div>
  </div>
  <?php endif; ?>

  <div class="comments-area"><?php comments_template(); ?></div>
</div>

<script>
(function(){
  // Parallax
  var hero = document.getElementById('singleHero');
  var bg = document.getElementById('singleHeroBg');
  if(hero && bg) {
    window.addEventListener('scroll', function() {
      var s = window.pageYOffset;
      if(s < hero.offsetHeight + 200)
        bg.style.transform = 'translateY(' + (s * 0.35) + 'px)';
    }, {passive:true});
  }

  // Smart bar — только мобилка
  var bar = document.getElementById('smartBar');
  var closeBtn = document.getElementById('smartBarClose');
  if(!bar) return;

  // Проверяем сессию — если уже закрыл в этой сессии, не показываем
  var SESSION_KEY = 'rhy_bar_closed';
  if(sessionStorage.getItem(SESSION_KEY)) return;

  var shown = false;
  var closed = false;

  function showBar() {
    if(closed || shown) return;
    shown = true;
    bar.classList.add('visible');
  }

  function hideBar() {
    bar.classList.remove('visible');
    closed = true;
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  // Крестик
  if(closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideBar();
    });
  }

  // Показываем после 40% скролла
  window.addEventListener('scroll', function() {
    if(closed) return;
    var docH = document.body.scrollHeight - window.innerHeight;
    var pct = window.pageYOffset / docH;

    // Скрываем у комментариев
    var comments = document.querySelector('.comments-area');
    if(comments) {
      var cTop = comments.getBoundingClientRect().top;
      if(cTop < window.innerHeight) {
        bar.classList.remove('visible');
        return;
      }
    }

    if(pct > 0.4) showBar();
  }, {passive:true});
})();
</script>

<?php get_footer(); ?>
