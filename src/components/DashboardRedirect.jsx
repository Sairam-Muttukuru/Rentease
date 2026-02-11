import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const slug = user?.name
                    ? user.name.toLowerCase().replace(/\s+/g, '-')
                    : 'user';
                const role = user?.role?.toLowerCase();

                if (role === 'landlord') {
                    navigate(`/${slug}/landlord/dashboard`, { replace: true });
                } else if (role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (role === 'service_provider') {
                    navigate('/service-provider/dashboard', { replace: true });
                } else {
                    // Default everyone else to Tenant Dashboard
                    navigate(`/${slug}/tenant/dashboard`, { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return null;
};

export default DashboardRedirect;
