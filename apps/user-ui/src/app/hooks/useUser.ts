import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { isProtected } from '../utils/protected';

// Fetch user data from API
const fetchUser = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get('/api/logged-in-user', config);

  return response.data.user;
};

const useUser = () => {
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(isLoggedIn),
    staleTime: 5 * 60 * 1000,
    retry: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    onSuccess: () => {
      setLoggedIn(true);
    },
    onError: () => {
      setLoggedIn(false);
    },
  });

  return { user: user as any, isLoading: isPending, isError };
};

export default useUser;
