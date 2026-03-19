#!/bin/bash
# Auto-generate sitemap.xml from all index.html files
# Runs automatically after each deploy

SITE_DIR="/var/www/rehabyou"
BASE_URL="https://rehabyou.site"
OUTPUT="$SITE_DIR/sitemap.xml"
TODAY=$(date +%Y-%m-%d)

get_priority() {
  local url="$1"
  if [ "$url" = "/" ]; then echo "1.0"
  elif [[ "$url" == /massage/* ]]; then echo "0.9"
  elif [[ "$url" == /subscriptions/ ]] || [[ "$url" == /certificates/ ]]; then echo "0.8"
  elif [[ "$url" == /masters/* ]]; then echo "0.7"
  elif [[ "$url" == /oferta/ ]] || [[ "$url" == /privacy/ ]]; then echo "0.3"
  else echo "0.6"
  fi
}

get_changefreq() {
  local url="$1"
  if [ "$url" = "/" ]; then echo "weekly"
  elif [[ "$url" == /oferta/ ]] || [[ "$url" == /privacy/ ]]; then echo "yearly"
  else echo "monthly"
  fi
}

echo '<?xml version="1.0" encoding="UTF-8"?>' > "$OUTPUT"
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$OUTPUT"

find "$SITE_DIR" -name "index.html" | sort | while read filepath; do
  url_path=$(echo "$filepath" | sed "s|$SITE_DIR||" | sed 's|/index.html$||')
  [ -z "$url_path" ] && url_path="/" || url_path="${url_path}/"
  priority=$(get_priority "$url_path")
  changefreq=$(get_changefreq "$url_path")
  echo "  <url>" >> "$OUTPUT"
  echo "    <loc>${BASE_URL}${url_path}</loc>" >> "$OUTPUT"
  echo "    <lastmod>${TODAY}</lastmod>" >> "$OUTPUT"
  echo "    <changefreq>${changefreq}</changefreq>" >> "$OUTPUT"
  echo "    <priority>${priority}</priority>" >> "$OUTPUT"
  echo "  </url>" >> "$OUTPUT"
done

echo '</urlset>' >> "$OUTPUT"
echo "Sitemap updated: $(grep -c '<url>' $OUTPUT) URLs -> $OUTPUT"
