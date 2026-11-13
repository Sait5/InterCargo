<template>
  <DashboardLayout>
        <div class="main-content">
      <header class="content-header">
        <div class="header-left">
          <h1>Отзывы</h1>
          <p>Отзывы заказчиков о вашей работе</p>
        </div>
      </header>

      <div class="reviews-summary">
        <div class="summary-card">
          <div class="summary-rating">
            <div class="rating-value">{{ averageRating }}</div>
            <div class="rating-stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= Math.round(averageRating) }">★</span>
            </div>
            <div class="rating-count">{{ reviews.length }} отзывов</div>
          </div>
          <div class="summary-bars">
            <div v-for="n in 5" :key="n" class="bar-row">
              <span class="bar-label">{{ 6 - n }} ★</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: getBarWidth(6 - n) + '%' }"></div>
              </div>
              <span class="bar-count">{{ getCountForRating(6 - n) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="exampleMode" class="example-banner">
        <span class="ex-chip">Пример</span>
        <span>Отзывов пока нет — так они будут выглядеть после выполненных рейсов. Рейтинг влияет на то, как часто вас выбирают заказчики.</span>
      </div>

      <div v-if="reviews.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <h3>Пока нет отзывов</h3>
        <p>Отзывы появятся после выполнения заказов</p>
      </div>

      <div v-else class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-card" :class="{ example: review.example }">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ getReviewerInitials(review) }}</div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ review.reviewerName }}</div>
                <div class="review-date">{{ formatDate(review.date) }}</div>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">★</span>
            </div>
          </div>
          <div class="review-order" v-if="review.orderRoute">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{{ review.orderRoute }}</span>
          </div>
          <div class="review-text">{{ review.text }}</div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/ui/DashboardLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useReviewStore } from '@/stores/reviews';
import { exampleReviews } from '@/data/examples';

const router = useRouter();
const userStore = useUserStore();
const reviewStore = useReviewStore();

const reviews = ref([]);
const exampleMode = ref(false);

const roleLabel = computed(() => {
  if (userStore.user?.accountType === 'carrier') return 'Перевозчик';
  return 'Пользователь';
});

const initials = computed(() => {
  if (!userStore.user) return '?';
  return (userStore.user.firstName?.[0] || '') + (userStore.user.lastName?.[0] || '');
});

const fullName = computed(() => {
  if (!userStore.user) return '';
  return `${userStore.user.firstName || ''} ${userStore.user.lastName || ''}`.trim();
});

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

const getBarWidth = (rating) => {
  if (reviews.value.length === 0) return 0;
  const count = reviews.value.filter(r => r.rating === rating).length;
  return (count / reviews.value.length) * 100;
};

const getCountForRating = (rating) => {
  return reviews.value.filter(r => r.rating === rating).length;
};

const getReviewerInitials = (review) => {
  if (!review.reviewerName) return '?';
  const parts = review.reviewerName.split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

onMounted(async () => {
  const res = await reviewStore.fetchMyReviews();
  if (!res.success) return;
  reviews.value = reviewStore.myReviews.map((r) => {
    const author = r.reviewerId || {};
    return {
      id: r._id,
      reviewerName: `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.company || 'Заказчик',
      rating: r.rating,
      text: r.text,
      date: r.createdAt,
    };
  });
  if (!reviews.value.length) {
    reviews.value = exampleReviews;
    exampleMode.value = true;
  }
});
</script>

<style scoped>
.profile-layout { display: flex; min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); }
.sidebar { width: 280px; background: rgba(255, 255, 255, 0.02); border-right: 1px solid var(--border-color); padding: 24px 20px; display: flex; flex-direction: column; gap: 24px; position: sticky; top: 0; height: 100vh; overflow-y: auto; backdrop-filter: blur(10px); }
.sidebar-header { padding: 8px 12px; }
.logo-area { display: flex; align-items: center; gap: 20px; cursor: pointer; text-decoration: none; min-height: 90px; }
.logo-icon { width: 90px; height: 90px; flex-shrink: 0; }
.logo-icon img { width: 100%; height: 100%; object-fit: contain; }
.logo-text { display: flex; flex-direction: column; line-height: 1.1; margin-left: -30px; }
.logo-cargo { font-size: 28px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-primary); }
.logo-express { font-size: 28px; font-weight: 800; color: var(--accent-color); letter-spacing: 1.5px; }
.user-card { display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; transition: all 0.3s ease; }
.user-card:hover { border-color: rgba(var(--accent-rgb), 0.3); }
.user-avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.user-info { overflow: hidden; flex: 1; }
.user-name-lg { font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 12px; color: var(--accent-color); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.user-email { font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s ease; cursor: pointer; position: relative; }
.nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }
.nav-link span { flex: 1; }
.nav-link:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); transform: translateX(2px); }
.nav-link.active { background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); font-weight: 600; }
.nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent-color); border-radius: 0 3px 3px 0; }
.nav-link.logout { color: var(--danger); margin-top: auto; }
.nav-link.logout:hover { background: rgba(var(--danger-rgb), 0.1); color: var(--danger); }
.main-content { flex: 1; padding: 40px; max-width: 1200px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 32px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.reviews-summary { margin-bottom: 32px; }
.example-banner { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 16px 20px; margin-bottom: 16px; border-radius: 16px; border: 1px dashed rgba(var(--accent-rgb), 0.45); background: rgba(var(--accent-rgb), 0.06); color: var(--text-secondary); font-size: 14px; }
.example-banner span:nth-child(2) { flex: 1; min-width: 220px; }
.ex-chip { padding: 4px 10px; border-radius: 999px; background: rgba(242, 184, 75, 0.16); color: var(--warm); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.review-card.example { border-style: dashed !important; }
.summary-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; display: flex; gap: 40px; align-items: center; }
.summary-rating { text-align: center; min-width: 160px; }
.rating-value { font-size: 56px; font-weight: 800; color: var(--accent-color); line-height: 1; }
.rating-stars { margin-top: 8px; }
.rating-count { font-size: 14px; color: var(--text-muted); margin-top: 8px; }
.star { font-size: 20px; color: rgba(255, 255, 255, 0.2); }
.star.active { color: var(--warm); }
.summary-bars { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.bar-row { display: flex; align-items: center; gap: 12px; }
.bar-label { font-size: 13px; color: var(--text-muted); width: 30px; text-align: right; }
.bar-track { flex: 1; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, var(--warm), #fbbf24); border-radius: 4px; transition: width 0.5s ease; }
.bar-count { font-size: 13px; color: var(--text-muted); width: 20px; }
.empty-state { text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state svg { color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p { font-size: 15px; color: var(--text-muted); }
.reviews-list { display: flex; flex-direction: column; gap: 16px; }
.review-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; }
.review-card:hover { border-color: rgba(var(--accent-rgb), 0.3); box-shadow: 0 10px 30px var(--shadow-color); }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.reviewer-info { display: flex; align-items: center; gap: 12px; }
.reviewer-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; flex-shrink: 0; }
.reviewer-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.review-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.review-order { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); margin-bottom: 12px; padding: 8px 12px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
.review-order svg { color: var(--accent-color); flex-shrink: 0; }
.review-text { font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
@media (max-width: 1024px) { .sidebar { display: none; } .summary-card { flex-direction: column; gap: 24px; } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .content-header h1 { font-size: 26px; } .summary-card { padding: 24px; } .rating-value { font-size: 42px; } }
</style>