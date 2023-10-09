import axios from 'axios';

export async function urlToUint8Array(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
  
      // Convert the array buffer to a Uint8Array
      const uint8Array = new Uint8Array(response.data);
  
      return uint8Array;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

