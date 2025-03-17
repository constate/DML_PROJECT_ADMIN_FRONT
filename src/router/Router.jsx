// import { Layout } from 'components/_layout/Layout';
// import { IframeLayout } from 'components/IframeLayout/IframeLayout';
// import { SolutionLayout } from 'components/SolutionLayout/SolutionLayout';
import { PATH } from './routePath';
import { HomePage, LoginPage, SignupPage, ErrorPage } from '../pages';

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<ErrorPage />}>
            <Route path={'/'} element={<HomePage />} />
            <Route path={PATH.Home} element={<HomePage />} />
            <Route path={PATH.Login} element={<LoginPage />} />
            <Route path={PATH.Signup} element={<SignupPage />} />
        </Route>,
    ),
);

// export const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route>
//             <Route path={PATH.Login} element={<LoginPage />} />
//             <Route element={<Layout />}>
//                 <Route path={PATH.Root} element={<HomePage />} />

//                 <Route path={PATH.Attendance} element={<AttendancePage />} />
//                 <Route path={PATH.Brand} element={<BrandPage />} />
//                 <Route path={PATH.Customer} element={<CustomerPage />} />
//                 <Route path={PATH.Payment} element={<PaymentPage />} />
//                 <Route path={PATH.Schedule} element={<SchedulePage />} />
//                 <Route path={PATH.Video} element={<VideoPage />} />

//                 <Route path={PATH.Center} element={<CenterPage />}>
//                     <Route path={PATH.Locker} element={<LockerPage />} />
//                     <Route path={PATH.LockerAdd} element={<LockerAdd />} />
//                     <Route path={PATH.LockerEdit} element={<LockerEdit />} />
//                     <Route path={PATH.LockerLog} element={<LockerLog />} />
//                     <Route
//                         path={PATH.Message}
//                         element={<MessageManagement />}
//                     />
//                     <Route
//                         path={PATH.Product}
//                         element={<ProductManagement />}
//                     />
//                     <Route
//                         path={PATH.Facility}
//                         element={<FacilityManagement />}
//                     />
//                     <Route
//                         path={PATH.Contract}
//                         element={<ContractManagement />}
//                     />
//                     <Route
//                         path={PATH.Setting}
//                         element={<SettingManagement />}
//                     />
//                 </Route>

//                 <Route path={'*'} element={<ErrorPage />} />
//             </Route>

//             <Route path={PATH.Solution} element={<SolutionLayout />}>
//                 <Route
//                     path={PATH.SolutionLocker}
//                     element={<SolutionLockerMain />}
//                 />
//                 <Route
//                     path={PATH.SolutionLockerAdd}
//                     element={<SolutionLockerAdd />}
//                 />
//                 <Route
//                     path={PATH.SolutionLockerEdit}
//                     element={<SolutionLockerEdit />}
//                 />
//             </Route>

//             <Route path={PATH.Iframe} element={<IframeLayout />}>
//                 <Route path={PATH.IframeLocker} element={<LockerPage />} />
//                 <Route path={PATH.IframeLockerAdd} element={<LockerAdd />} />
//                 <Route path={PATH.IframeLockerEdit} element={<LockerEdit />} />
//                 <Route path={PATH.IframeLockerLog} element={<LockerLog />} />
//             </Route>
//         </Route>,
//     ),
// );
