import Tts from 'react-native-tts';

Tts.setDefaultLanguage('ur-PK');
export const getAudio = async(title: string) => {
   await Tts.speak(title);
}