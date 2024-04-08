import  ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { HelmetProvider } from "react-helmet-async";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
        <HelmetProvider>
            <QueryProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryProvider>
        </HelmetProvider>
    </Router>
)