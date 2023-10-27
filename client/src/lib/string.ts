export const formatAngka = (angka: number) => {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


  

  