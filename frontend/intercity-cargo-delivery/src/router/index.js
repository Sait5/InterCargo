import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Profile from "../pages/Profile.vue"
import Settings from "../pages/Settings.vue"
import AdminPanel from "../pages/AdminPanel.vue"
import MyApplications from "../pages/MyApplications.vue"
import { useUserStore } from '@/stores/user'

const routes = [
  { 
    path: "/", 
    name: "Home", 
    component: Home 
  },
  { 
    path: "/login", 
    name: "Login", 
    component: Login 
  },
  { 
    path: "/register", 
    name: "Register", 
    component: Register 
  },
  { 
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: "/settings", 
    name: "Settings", 
    component: Settings,
    meta: { requiresAuth: true }
  },
  { 
    path: "/admin",
    name: "AdminPanel",
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: "/transport-tender", 
    name: "TransportTender", 
    component: () => import("../pages/TransportTender.vue") 
  },
  { 
    path: "/services", 
    name: "Services", 
    component: () => import("../fallback/Services.vue") 
  },
  { 
    path: "/orders", 
    name: "Orders", 
    component: () => import("../pages/Orders.vue"),
    meta: { requiresAuth: true }
  },
  { 
    path: "/carriers", 
    name: "Carriers", 
    component: () => import("../pages/Carriers.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/my-applications",
    name: "MyApplications",
    component: MyApplications,
    meta: { requiresAuth: true }
  },
  {
    path: "/documents",
    name: "Documents",
    component: () => import("../pages/Documents.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/reviews",
    name: "Reviews",
    component: () => import("../pages/Reviews.vue"),
    meta: { requiresAuth: true }
  },
  { 
    path: "/feature/analytics", 
    name: "AnalyticsModule", 
    component: () => import("../features/AnalyticsModule.vue") 
  },
  { 
    path: "/feature/end-to-end", 
    name: "EndToEndProcess", 
    component: () => import("../features/EndToEndProcess.vue") 
  },
  { 
    path: "/feature/independence", 
    name: "IndependenceModule", 
    component: () => import("../features/IndependenceModule.vue") 
  },
    {
    path: "/chat",
    name: "Chat",
    component: () => import("../pages/Chat.vue"),
    meta: { requiresAuth: true }
  },
  {
path: "/spot-auctions",
name: "SpotAuctions",
component: () => import("../pages/SpotAuctions.vue"),
meta: { requiresAuth: true }
},
{
  path: "/spot-auctions",
  name: "SpotAuctions",
  component: () => import("../pages/SpotAuctions.vue"),
  meta: { requiresAuth: true }
},
{
  path: "/create-auction",
  name: "CreateAuction",
  component: () => import("../pages/CreateAuction.vue"),
  meta: { requiresAuth: true }
},
{
  path: "/auction/:id",
  name: "AuctionBidding",
  component: () => import("../pages/AuctionBidding.vue"),
  meta: { requiresAuth: true }
},
{
  path: "/auctions",
  name: "AuctionList",
  component: () => import("../pages/AuctionList.vue"),
  meta: { requiresAuth: true }
},
{
  path: "/services",
  name: "Services",
  component: () => import("../pages/Services.vue")
},
{
  path: "/about",
  name: "About",
  component: () => import("../pages/About.vue")
},
{
  path: "/contacts",
  name: "Contacts",
  component: () => import("../pages/Contacts.vue")
},

  { 
    path: "/feature/verified", 
    name: "VerifiedCarriers", 
    component: () => import("../features/VerifiedCarriers.vue") 
  },
  {
  path: "/tms",
  name: "TMS",
  component: () => import("../pages/TMS.vue")
},
{
  path: "/tracking",
  name: "Tracking",
  component: () => import("../pages/Tracking.vue")
},
  { 
    path: "/:pathMatch(.*)*", 
    name: "NotFound",
    component: () => import("../fallback/NotFound.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: "instant" })
        }, 50)
      })
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  if (to.meta.requiresAdmin && token) {
    const userStore = useUserStore()
    if (!userStore.isAdmin) {
      next('/profile')
      return
    }
  }
  
  next()
})

export default router