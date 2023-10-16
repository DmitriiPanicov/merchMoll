import { FC } from 'react';
import { Link } from 'react-router-dom';

import IntegrationErrors from './pages/easymerch/integrationErrors/integrationErrors';
import ServiceTypes from './pages/easymerch/serviceTypes/serviceTypes';
import Reports from './pages/easymerch/reports/reports';
import Outlets from './pages/easymerch/outlets/outlets';
import Sidebar from './components/sidebar/Sidebar';
import Users from './pages/easymerch/users/users';

import './App.scss';

const App: FC = () => {
  return (
    <div className='App'>
      <Sidebar />

      <div className='content'>
        <div className='content__title'>
          <h4>Трекеры</h4>
          <div className='breadcrumbs'>
            <span>Merch Online</span>
            <span>easymerch</span>
          </div>
        </div>

        <div className='content__main'>
          <div className='btns'>
            <Link to='/easymerch/outlets' className='tab'>
              <div className='buttons__btn'>Торговые точки</div>
            </Link>
            <Link to='/easymerch/report' className='tab'>
              <div className='buttons__btn'>Типы отчетов</div>
            </Link>
            <Link to='/easymerch/users' className='tab'>
              <div className='buttons__btn'>Физ.лица</div>
            </Link>
            <Link to='/easymerch/service-types' className='tab'>
              <div className='buttons__btn'>Типы обслуживания</div>
            </Link>
            <Link to='/easymerch/integration-errors' className='tab'>
              <div className='buttons__btn'>Ошибки интеграции</div>
            </Link>
          </div>
          {window.location.pathname === '/easymerch/report' && <Reports />}
          {window.location.pathname === '/easymerch/outlets' && <Outlets />}
          {window.location.pathname === '/easymerch/users' && <Users />}
          {window.location.pathname === '/easymerch/service-types' && (
            <ServiceTypes />
          )}
          {window.location.pathname === '/easymerch/integration-errors' && (
            <IntegrationErrors />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
