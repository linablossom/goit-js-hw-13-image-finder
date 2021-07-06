import {
  START_PAGE,
  PER_PAGE,
  ORIENTATION,
  PIXABAY_API_KEY,
} from "./config.js";

export const getImages = async (
  keyword,
  pageNum = START_PAGE,
  perPage = PER_PAGE,
  orientation = ORIENTATION
) => {
  const URL = `https://pixabay.com/api/?image_type=photo&orientation=${orientation}&q=${keyword}&page=${pageNum}&per_page=${perPage}&key=${PIXABAY_API_KEY}`;
  const response = await fetch(URL);

  return response.json();
};

export default { getImages };
