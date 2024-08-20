import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons
import Notification from '../Admin/Notification'; // Adjust the import path as needed

const Tab = createBottomTabNavigator();

const Bottomtab = () => {
  console.log('Rendering Navigator');
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Board') {
              iconName = 'home'; // Icon name from MaterialCommunityIcons
            } else if (route.name === 'Notification') {
              iconName = 'bell'; // Icon name from MaterialCommunityIcons
            }

            return (
              <MaterialCommunityIcons
                name={iconName} // Use the iconName variable
                color={color} // Use the color provided by screenOptions
                size={size} // Use the size provided by screenOptions
              />
            );
          },
        })}
      >
        <Tab.Screen name="Notification" component={Notification} />
        {/* Add other screens here */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Bottomtab;
