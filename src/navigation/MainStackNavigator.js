import { createStackNavigator } from '@react-navigation/stack';
import SellerDashboardScreen from '../screens/seller/DashboardScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator; 