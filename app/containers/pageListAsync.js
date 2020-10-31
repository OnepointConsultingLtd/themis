import Loadable from 'react-loadable';
import Loading from 'ba-components/Loading';

// Dashboard
export const DashboardV1 = Loadable({
  loader: () => import('./Dashboard/Dashboard'),
  loading: Loading,
});

// Simple-Table
export const SimpleTable = Loadable({
  loader: () => import('./Tables/BasicTable'),
  loading: Loading,
});

// CRUD-Table
export const CrudTable = Loadable({
  loader: () => import('./Tables/crudTable'),
  loading: Loading,
});

// Advanced-Table
export const DSLGeneratorParentTable = Loadable({
  loader: () => import('./Tables/DSLGeneratorParentTable'),
  loading: Loading,
});

// Advanced-Filter Table
export const RulesManagerParentTable = Loadable({
  loader: () => import('./Tables/RulesManagerParentTable'),
  loading: Loading,
});

// Forms
export const ReduxForm = Loadable({
  loader: () => import('./Forms/ReduxForm'),
  loading: Loading,
});

// Pages
export const Login = Loadable({
  loader: () => import('./Pages/Users/Login'),
  loading: Loading,
});
export const Register = Loadable({
  loader: () => import('./Pages/Users/Register'),
  loading: Loading,
});
export const ResetPassword = Loadable({
  loader: () => import('./Pages/Users/ResetPassword'),
  loading: Loading,
});
export const Configuration = Loadable({
  loader: () => import('./Configuration'),
  loading: Loading,
});
export const LoginDedicated = Loadable({
  loader: () => import('./Pages/Standalone/LoginDedicated'),
  loading: Loading,
});

// Other
export const NotFound = Loadable({
  loader: () => import('./NotFound/NotFound'),
  loading: Loading,
});
export const NotFoundDedicated = Loadable({
  loader: () => import('./Pages/Standalone/NotFoundDedicated'),
  loading: Loading,
});
export const Error = Loadable({
  loader: () => import('./Pages/Error'),
  loading: Loading,
});
export const Maintenance = Loadable({
  loader: () => import('./Pages/Maintenance'),
  loading: Loading,
});
export const Parent = Loadable({
  loader: () => import('./Parent'),
  loading: Loading,
});
