import 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Routes from './src/routes/routes';
import { UserProvider } from './src/context/userContext';

export default function App() {
  return (
    <UserProvider>
    <Routes/>
    </UserProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3C4BC',
    padding: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  appName: {
    fontSize: 16,  
    fontWeight: 'bold',  
    color: '#333',  
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#537D8D',
    padding: 15,
    marginVertical: 10,
    width: '80%',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
