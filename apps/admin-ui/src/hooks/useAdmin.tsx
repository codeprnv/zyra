import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axiosInstance from '../shared/utils/axiosInstance';

const fetchAdmin = async () => {
  const response = await axiosInstance.get('/api/logged-in-admin');

  return response.data.admin;
};

const useAdmin = () => {
  //   const { isLoggedIn, setLoggedIn } = useAuthStore();

  const {
    data: admin,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin'],
    queryFn: fetchAdmin,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const history = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) {
      history.push('/');
    }
  }, [admin, isLoading]);

  return { admin, isLoading, isError, refetch };
};

export default useAdmin;
