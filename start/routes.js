'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { api: 'Uptime.ng is a web asset monitoring tool.' }
})

// =========== USER MANAGEMENT ROUTE STARTS ========================
Route.post('/register', 'UserManagement/User/RegistrationController.register').validator('Registration');
Route.get('/account/verify/:verification_code', 'UserManagement/User/RegistrationController.verifyAccount');
Route.post('/account/resend-code', 'UserManagement/User/RegistrationController.resendVerificationCode');

// =========== USER MANAGEMENT ROUTE ENDS ========================


// =========== AUTHENTICATION ROUTE STARTS ========================

Route.post('/login', 'Authentication/LoginController.login');
Route.post('/logout', 'Authentication/LogoutController.logOut').middleware(['auth:jwt',]);

// =========== AUTHENTICATION ROUTE ENDS ===========================


// =========== PROFILE MANAGEMENT ROUTE STARTS ========================

Route.get('/auth/profile', 'ProfileManagement/ProfileController.viewProfile').middleware(['auth:jwt']);
Route.put('/auth/edit-profile', 'ProfileManagement/ProfileController.editProfile').validator('EditProfile').middleware(['auth:jwt']);


Route.put('/auth/change-password', 'ProfileManagement/PasswordController.changePassword').validator('ChangePassword').middleware(['auth:jwt']);
Route.post('/forgot-password', 'ProfileManagement/PasswordController.forgotPassword');
Route.put('/reset-password/:verification_code','ProfileManagement/PasswordController.resetPassword').validator('ResetPassword');

// =========== PROFILE MANAGEMENT ROUTE ENDS ========================


// =========== PROJECT MANAGEMENT ROUTE STARTS ========================
Route.post('/auth/projects', 'ProjectManagement/ProjectController.addProject').validator('AddProject').middleware(['auth:jwt']);
Route.patch('/auth/projects/:project_id', 'ProjectManagement/ProjectController.editProject').validator('EditProject').middleware(['auth:jwt']);
Route.delete('/auth/projects/:project_id', 'ProjectManagement/ProjectController.deleteProject').middleware(['auth:jwt']);
Route.get('/auth/projects', 'ProjectManagement/ProjectController.myProjects').middleware(['auth:jwt']);
Route.patch('/auth/projects/monitoring-status/:project_id', 'ProjectManagement/ProjectController.toggleProjectMonitoringStatus').validator('MonitoringStatus').middleware(['auth:jwt']);
Route.get('/engine/projects', 'ProjectManagement/ProjectController.projectListing')//.middleware(['auth:jwt']);
Route.patch('/engine/projects/report-status/:project_id', 'ProjectManagement/ProjectController.updateProjectReportStatus').validator('ProjectReportStatus')//.middleware(['auth:jwt']);


// =========== PROJECT MANAGEMENT ROUTE ENDS ========================


// =========== BILLING ROUTE STARTS ========================
Route.post('/auth/tokenize-card', 'Billing/SubscriptionController.tokenizeCard').middleware(['auth:jwt']);
Route.post('/auth/verify-card', 'Billing/SubscriptionController.verifyCard').middleware(['auth:jwt']);
Route.post('/auth/subscribe', 'Billing/SubscriptionController.subscribe').middleware(['auth:jwt']);
Route.post('/verify/subscription', 'Billing/SubscriptionController.verifySubscription')

Route.get('/auth/plans', 'Billing/PlanController.getPlans').middleware(['auth:jwt']);

Route.post('/payment/webhook', 'Billing/SubscriptionController.paymentWebHook')



// =========== BILLING ROUTE ENDS ========================


// Route.on('/email').render('emails.verification_email');
// Route.on('/email').render('emails.reset_password_email');
// Route.on('/email').render('emails.project_report_status_email');
Route.on('/email').render('emails.project_ssl_expiry_report_email');

