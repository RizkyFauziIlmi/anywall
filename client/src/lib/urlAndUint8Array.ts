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

export function uint8ArrayToDataUri(uint8Array: Uint8Array) {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return 'data:image/png;base64,' + window.btoa(binary);
}
