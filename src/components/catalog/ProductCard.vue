<script setup>
import { computed } from 'vue'
import { currency, imageUrl } from '../../utils/catalog'
const props = defineProps({ product: { type: Object, required: true } })
const cover = computed(() => imageUrl(props.product.images?.[0]?.image))
</script>
<template>
  <article class="product-card">
    <RouterLink :to="`/produto/${product.slug}`" :aria-label="`Ver ${product.name}`">
      <div class="product-photo">
        <img v-if="cover" :src="cover" :alt="product.images[0].alt_text" loading="lazy" />
        <span v-else class="missing-image"><b aria-hidden="true">♡</b><small>Foto ainda não cadastrada</small></span>
        <span v-if="product.is_featured" class="featured">Destaque</span>
      </div>
      <div class="details">
        <p class="category">{{ product.category.name }}</p>
        <h3>{{ product.name }}</h3>
        <p class="price">{{ currency(product.effective_price) }} <small>/ {{ product.unit }}</small></p>
        <span v-if="!product.is_available" class="unavailable">Temporariamente indisponível</span>
        <span v-else class="shop">Ver produto <span aria-hidden="true">→</span></span>
      </div>
    </RouterLink>
  </article>
</template>
<style scoped>
.product-card { background: #fff; border: 1px solid var(--color-border);
  border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-card);
  transition: transform .2s ease, box-shadow .2s ease; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 20px 35px #a0456720; }
.product-card a { text-decoration: none; display: block; color: inherit; }
.product-photo { position: relative; aspect-ratio: 4/3; background: linear-gradient(145deg,#fff2f5,#fbe6dc);
  display: grid; place-items: center; overflow: hidden; }
.product-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .25s; }
.product-card:hover img { transform: scale(1.06); }
.missing-image { color: #b85b80; display: grid; justify-items: center; gap: .2rem; }\n.missing-image b { color: #e8abc1; font-size: 4rem; line-height: 1; }\n.missing-image small { font-size: .78rem; }
.featured { position: absolute; left: .7rem; top: .7rem; font-size: .72rem; font-weight: 800;
  color: #9b3165; background: #fff8fb; padding: .25rem .6rem; border-radius: 99px; }
.details { padding: 1rem 1.2rem 1.3rem; }
.category { color: var(--color-primary-hover); font-size: .76rem; margin: 0; font-weight: 800; text-transform: uppercase; }
h3 { font-size: 1.1rem; margin: .4rem 0 .8rem; min-height: 2.5rem; }
.price { font-weight: 800; color: var(--color-primary-hover); font-size: 1.1rem; }
.price small { font-size: .73rem; font-weight: 500; color: #7c6570; }
.shop { display: inline-block; padding: .5rem .75rem; border-radius: 10px;
  background: var(--color-primary); color: white; font-size: .76rem; font-weight: 800; }
.unavailable { color: #a34458; font-size: .78rem; }
</style>
