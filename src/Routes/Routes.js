import Dashboard from "../Views/dashboard/index"

import WelcomePage from "../Views/welcome"

import Signin from "../Views/Auth/SignIn"
import Signup from "../Views/Auth/SignUp"

import Category from "../Views/Category/category"
import SubCategory from "../Views/Category/subcategory"

import About from "../Views/about"

import Blog from "../Views/blog"

import Companies from "../Views/companies"

import TrendingBusiness from "../Views/trending"

import Deals from "../Views/deals"

import Dubai from "../Views/dubai/index"

import BusinessPricing from "../Views/pricing"

import IntergrationLogo from "../Views/businessSection/integrationlogo"

import CompanyLogo from "../Views/businessSection/companyLogo"

import AddStaff from "../Views/staff"

import Users from "../Views/staff/user"

import Profile from "../Views/profile"

import UpdatePassword from "../Views/password"

import Settings from "../Views/settings"

import CRM from "../Views/crm"

import Reviews from "../Views/reviews"

import Analytics from "../Views/analytics"

import BusinessShow from "../Views/trending/business"

const routes =[  

    {path:'/', element:<WelcomePage />, exact:'true', type:'public' },
    
    {path:'/sign-up', element:<Signup />, exact:'true', type:'public' },
    {path:'/sign-in', element:<Signin />, exact:'true', type:'public' },


    {path:'/dashboard', element:<Dashboard />, exact:'true', type:'private' },

    {path:'/category', element:<Category />, exact:'true', type:'private' },
    {path:'/sub-category', element:<SubCategory />, exact:'true', type:'private' },

    {path:'/about', element:<About />, exact:'true', type:'private' },

    {path:'/blog', element:<Blog />, exact:'true', type:'private' },

    {path:'/companies', element:<Companies />, exact:'true', type:'private' },

    {path:'/businesses', element:<TrendingBusiness />, exact:'true', type:'private' },

    {path:'/deals', element:<Deals />, exact:'true', type:'private' },

    {path:'/dubai', element:<Dubai />, exact:'true', type:'private' },

    {path:'/business-pricing', element:<BusinessPricing />, exact:'true', type:'private' },

    {path:'/int-logo', element:<IntergrationLogo />, exact:'true', type:'private' },

    {path:'/comp-logo', element:<CompanyLogo />, exact:'true', type:'private' },

    {path:'/add-staff', element:<AddStaff />, exact:'true', type:'private' },

    {path:'/profile-settings', element:<Profile />, exact:'true', type:'private' },

    {path:'/privacy-settings', element:<UpdatePassword />, exact:'true', type:'private' },

    {path:'/settings', element:<Settings />, exact:'true', type:'private' },

    {path:'/crm', element:<CRM />, exact:'true', type:'private' },

    {path:'/users', element:<Users />, exact:'true', type:'private' },

    {path:'/reviews', element:<Reviews />, exact:'true', type:'private' },

    {path:'/analytics', element:<Analytics />, exact:'true', type:'private' },

    {path:'/business-show', element:<BusinessShow />, exact:'true', type:'private' },

]

export default routes 