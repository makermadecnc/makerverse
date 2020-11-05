import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { Provider as GridSystemProvider } from 'app/components/GridSystem';
import ProtectedRoute from '../components/ProtectedRoute';
import App from './App';
import Login from './Login';
import Callback from './Login/Callback';

const AppRouter = () => {
    return (
        <GridSystemProvider
            breakpoints={[576, 768, 992, 1200]}
            containerWidths={[540, 720, 960, 1140]}
            columns={12}
            gutterWidth={0}
            layout="floats"
        >
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/callback" component={Callback} />
                    <ProtectedRoute path="/" component={App} />
                </Switch>
            </Router>
        </GridSystemProvider>
    );
};

export default AppRouter;
