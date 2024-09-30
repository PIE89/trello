export default async function getImage() {
  const data = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await data.json();
  return result[0].url;
}
