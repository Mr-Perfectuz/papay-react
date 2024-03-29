import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrovBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { MonetizationOn } from "@mui/icons-material";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Rating from "@mui/material/Rating";

//REDUX
import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useHistory, useParams } from "react-router-dom";
import {
  retreiveChosenRestaurants,
  retreiveRandomRestaurants,
  retreiveTargetProducts,
} from "../RestaurantPage/selector";
//REDUX
import { useDispatch, useSelector } from "react-redux";
import { Restaurant } from "../../../types/user";
import { serviceApi } from "../../../lib/config";
import {
  setChosenProduct,
  setChosenRestaurants,
  setRandomRestaurants,
  setTargetProducts,
} from "./slice";
import RestaurantApiService from "../../apiServices/restaurantApiService";
import { ProductSearchObj } from "../../../types/others";
import assert from "assert";
import { Definer } from "../../../lib/Definer";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import MemberApiService from "../../apiServices/memberApiService";
import ProductApiService from "../../apiServices/productApiService";
import { Product } from "../../../types/products";
import { verifierMemberData } from "../../apiServices/vertify";

// REDUX SLICE
const actionDispatch = (dispatch: Dispatch) => ({
  setRandomRestaurants: (data: Restaurant[]) =>
    dispatch(setRandomRestaurants(data)),
  setChosenRestaurants: (data: Restaurant) =>
    dispatch(setChosenRestaurants(data)),
  setTargetProducts: (data: Product[]) => dispatch(setTargetProducts(data)),
  setChosenProduct: (data: Product[]) => dispatch(setChosenProduct(data)),
});

//REDUX SELECTORS
const randomRestaurantRetriever = createSelector(
  retreiveRandomRestaurants,
  (randomRestaurants) => ({ randomRestaurants })
);
const chosenRestaurantRetriever = createSelector(
  retreiveChosenRestaurants,
  (chosenRestaurants) => ({ chosenRestaurants })
);
const targetProductstRetriever = createSelector(
  retreiveTargetProducts,
  (targetProducts) => ({ targetProducts })
);

export default function OneRestaurant(props: any) {
  /**  INITIALIZATION */
  let { restaurant_id } = useParams<{ restaurant_id: string }>();
  const { setChosenRestaurants, setRandomRestaurants, setTargetProducts } =
    actionDispatch(useDispatch());

  const [targetProductSearchObject, setTargetProductSeachObject] =
    useState<ProductSearchObj>({
      page: 1,
      limit: 8,
      order: "createdAt",
      restaurant_mb_id: restaurant_id,
      product_collection: "dish",
    });
  const { randomRestaurants } = useSelector(randomRestaurantRetriever);
  const { chosenRestaurants } = useSelector(chosenRestaurantRetriever);
  const { targetProducts } = useSelector(targetProductstRetriever);

  const [productRebuild, setProductRedbuild] = useState<Date>(new Date());

  const [chosenRestaurantId, setchosenRestaurantId] =
    useState<string>(restaurant_id);

  const [value, setValue] = React.useState<number | null>(4);

  useEffect(() => {
    const restaurantService = new RestaurantApiService();

    restaurantService
      .getRestaurants({ page: 1, limit: 10, order: "random" })
      .then((data) => {
        setRandomRestaurants(data);
      })
      .catch((err) => console.log(err));

    // chosen restaurant
    restaurantService
      .getChosenRestaurants(chosenRestaurantId)
      .then((data) => setChosenRestaurants(data))
      .catch((err) => console.log("err:", err));

    const productService = new ProductApiService();
    productService
      .getTargetProducts(targetProductSearchObject)
      .then((data) => {
        setTargetProducts(data);
      })
      .catch((err) => console.log(err));
  }, [chosenRestaurantId, targetProductSearchObject, productRebuild]);

  // HANDLERs
  const history = useHistory();
  const chosenDishHandler = (id: any) => {
    history.push(`/restaurant/dish/${id}`);
  };
  const chosenRestaurantHandler = (id: string) => {
    setchosenRestaurantId(id);
    targetProductSearchObject.restaurant_mb_id = id;
    setTargetProductSeachObject({ ...targetProductSearchObject });
    history.push(`/restaurant/${id}`);
  };

  const searchCollectionHandler = (collection: string) => {
    targetProductSearchObject.page = 1;
    targetProductSearchObject.product_collection = collection;
    setTargetProductSeachObject({ ...targetProductSearchObject });
  };
  const searchOrderHandler = (order: string) => {
    targetProductSearchObject.page = 1;
    targetProductSearchObject.order = order;
    setTargetProductSeachObject({ ...targetProductSearchObject });
  };
  Object.assign({}, chosenRestaurants);
  //Like handlers

  const targetLikeProduct = async (e: any) => {
    try {
      console.log("targetLikeProduct function called");
      assert.ok(verifierMemberData, Definer.auth_err);

      const memberApiService = new MemberApiService();

      const like_result: any = await memberApiService.memberLikeTarget({
        like_ref_id: e.target.id,
        group_type: "product",
      });

      console.log("Like Result:", like_result);
      assert.ok(like_result, Definer.general_err);
      await sweetTopSmallSuccessAlert("success", 700, false);
      setProductRedbuild(new Date());
    } catch (err: any) {
      console.log("targetLikeProduct, ERROR::", err);
      await sweetErrorHandling(err).then();
    }
  };

  return (
    <div className="single_restaurant">
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className="avatar_big_box">
            <Box className="top_text">
              <p>Texas De Brasil Restaurant</p>
              <Box className="single_search_big_box">
                <form className="single_search_form" action="" method="">
                  <input
                    type="search"
                    name="single_resSearch"
                    className="single_searchInput"
                    placeholder="Qidiruv"
                  />
                  <Button
                    className="single_button_search"
                    variant="contained"
                    sx={{
                      background: " #f8be69",
                      borderRadius: "0px 18px 18px 00px",
                      height: "33px",
                      "&:hover": {
                        backgroundColor: "#f8be69",
                        opacity: " 0.8",
                      },
                      "&:active": {
                        backgroundColor: "#f8be69",
                        opacity: "0.6",
                      },
                    }}
                    endIcon={<SearchIcon />}
                  >
                    Izlash
                  </Button>
                </form>
              </Box>
            </Box>
          </Stack>

          <Stack
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              marginTop: "35px",
            }}
          >
            <Box className="prev_btns restaurant_prev">
              <ArrovBackIosNewIcon sx={{ fontSize: 40, color: "#fff" }} />
            </Box>
            <Swiper
              className="restaurant_avatars_wrapper"
              slidesPerView={7}
              centeredSlides={false}
              spaceBetween={10}
              navigation={{
                nextEl: ".restaurant_next",
                prevEl: ".restaurant_prev",
              }}
            >
              {randomRestaurants.map((ele: Restaurant, index) => {
                const image_path = `${serviceApi}/${ele.mb_image}`;
                return (
                  <SwiperSlide
                    onClick={() => chosenRestaurantHandler(ele._id)}
                    style={{ cursor: "pointer", width: "110px" }}
                    key={index}
                    className="restaurant_avatars"
                  >
                    <img
                      className="avatar_img"
                      src={image_path}
                      alt="res img"
                      width="80px"
                      height="80px"
                    />
                    <span className="avatar_text">{ele.mb_nick}</span>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <Box className="prev_btns restaurant_next">
              <ArrowForwardIosIcon sx={{ fontSize: 40, color: "#fff" }} />
            </Box>
          </Stack>

          <Stack
            flexDirection={"row"}
            justifyContent={"flex-end"}
            sx={{ width: "100%", mt: "65px" }}
          >
            <Box className="dish_filter_box">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => searchOrderHandler("createdAt")}
              >
                new
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => searchOrderHandler("product_price")}
              >
                price
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => searchOrderHandler("product_likes")}
              >
                likes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => searchOrderHandler("product_views")}
              >
                views
              </Button>
            </Box>
          </Stack>

          <Stack
            flexDirection={"row"}
            style={{
              width: "1320px",
              display: "flex",
              minHeight: "600px",
              marginTop: "60px",
            }}
          >
            <Stack className="dish_category_box" sx={{ width: "100px" }}>
              <div className="dish_category_main">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => searchCollectionHandler("etc")}
                >
                  boshqa
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => searchCollectionHandler("dessert")}
                >
                  desert
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => searchCollectionHandler("drink")}
                >
                  ichimlik
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => searchCollectionHandler("salad")}
                >
                  salad
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => searchCollectionHandler("dish")}
                >
                  ovqatlar
                </Button>
              </div>
            </Stack>

            <Stack
              className="dish_wrapper"
              flexDirection={"row"}
              sx={{ width: "100%" }}
            >
              {/* PRODUCT LIST MAPPING */}
              {targetProducts.map((product: Product, index) => {
                const image_path = `${serviceApi}/${product.product_images[0]}`;
                const size_volume =
                  product.product_collection === "drink"
                    ? product.product_volume + "l"
                    : product.product_size + " size";
                return (
                  <Box
                    onClick={() => chosenDishHandler(product._id)}
                    className="dish_box"
                    key={index}
                  >
                    <Stack className="dish_img">
                      <Box className="dish_sale">{size_volume}</Box>
                      <Box
                        className="view_btn_one"
                        sx={{
                          width: "255px",
                          height: "165px",
                          opacity: 1,
                          backgroundImage: `url(${image_path})`,
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <Stack
                          className="view_btn_inner"
                          flexDirection={"row"}
                          alignItems={"center"}
                          sx={{ position: "relative" }}
                        >
                          <Button
                            className="like_view_btn"
                            sx={{
                              background: "#B4B4B4",
                              border: "1px solid #B4B4B4 ",
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              marginRight: "20px",
                            }}
                          >
                            <Badge
                              badgeContent={product.producta_likes}
                              color="primary"
                            >
                              <Checkbox
                                onClick={targetLikeProduct}
                                icon={
                                  <FavoriteBorder
                                    style={{
                                      color: "white",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                }
                                // id={`${index}`}
                                id={product._id}
                                checkedIcon={
                                  <Favorite style={{ color: "red" }} />
                                }
                                checked={
                                  product?.me_liked &&
                                  product?.me_liked[0]?.my_favorite
                                    ? true
                                    : false
                                }
                              ></Checkbox>
                            </Badge>
                          </Button>
                          <Button
                            className="like_badge_btn"
                            sx={{
                              border: "1px solid #e3c08d",
                              background: "#BB2FC8",

                              width: "40px",
                              height: "40px",
                            }}
                          >
                            <IconButton
                              aria-label="card"
                              id="basic-button"
                              onClick={(e) => {
                                props.onAdd(product);
                                e.stopPropagation();
                              }}
                            >
                              <Badge color="primary">
                                <img
                                  src="/icons/shopping_cart.svg"
                                  alt="shopping card icon"
                                />
                              </Badge>
                            </IconButton>
                          </Button>

                          <Button
                            className="like_view_btn"
                            sx={{
                              background: "#B4B4B4",
                              border: "1px solid #B4B4B4 ",
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              marginLeft: "20px",
                            }}
                          >
                            <Badge
                              badgeContent={product.product_views}
                              color="primary"
                            >
                              <Checkbox
                                icon={
                                  <RemoveRedEyeIcon
                                    style={{ color: "white" }}
                                  />
                                }
                              ></Checkbox>
                            </Badge>
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                    <Stack
                      sx={{ width: "90%", mt: "18px" }}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Box className="dish_name">{product.product_name}</Box>
                      <Box className="dish_price">
                        <MonetizationOn />
                        {product.product_price}
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <div className="review_for_restaurant">
        <Box className="review_text">Oshxona haqida fikrlar</Box>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
          sx={{
            marginBottom: "100px",
            width: "1320px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Stack className="review_box">
            <img
              className="review_img"
              src="/restaurant/review1.png"
              alt="review text"
            />
            <Box className="review_name">Eminova Dilnoza</Box>
            <Box className="review_status">Foydalanuvchi</Box>
            <Box className="review_comment">
              Menga bu oshxonaning taomlari juda yoqadi. <br /> Hammaga tafsiya
              qilaman!!!
              <Box
                sx={{
                  "& > legend": { mt: 2 },
                  mt: "10px",
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                <Rating
                  name="simple-controlled"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Box>
            </Box>
          </Stack>
          <Stack className="review_box">
            <img
              className="review_img"
              src="/restaurant/review1.png"
              alt="review text"
            />
            <Box className="review_name">Eminova Dilnoza</Box>
            <Box className="review_status">Foydalanuvchi</Box>
            <Box className="review_comment">
              Menga bu oshxonaning taomlari juda yoqadi. <br /> Hammaga tafsiya
              qilaman!!!
              <Box
                sx={{
                  "& > legend": { mt: 2 },
                  mt: "10px",
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                <Rating
                  name="simple-controlled"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Box>
            </Box>
          </Stack>
          <Stack className="review_box">
            <img
              className="review_img"
              src="/restaurant/review1.png"
              alt="review text"
            />
            <Box className="review_name">Eminova Dilnoza</Box>
            <Box className="review_status">Foydalanuvchi</Box>
            <Box className="review_comment">
              Menga bu oshxonaning taomlari juda yoqadi. <br /> Hammaga tafsiya
              qilaman!!!
              <Box
                sx={{
                  "& > legend": { mt: 2 },
                  mt: "10px",
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                <Rating
                  name="simple-controlled"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Box>
            </Box>
          </Stack>
          <Stack className="review_box">
            <img
              className="review_img"
              src="/restaurant/review1.png"
              alt="review text"
            />
            <Box className="review_name">Eminova Dilnoza</Box>
            <Box className="review_status">Foydalanuvchi</Box>
            <Box className="review_comment">
              Menga bu oshxonaning taomlari juda yoqadi. <br /> Hammaga tafsiya
              qilaman!!!
              <Box
                sx={{
                  "& > legend": { mt: 2 },
                  mt: "10px",
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                <Rating
                  name="simple-controlled"
                  value={value}
                  size="large"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Stack>
      </div>

      <Container className="about_res">
        <Stack alignItems={"center"} flexDirection={"column"}>
          <Box className="about_res_title">Oshxona haqida</Box>

          <Stack flexDirection={"row"}>
            <Stack
              className="res_img_box"
              sx={{
                backgroundImage: `url(${serviceApi}/${chosenRestaurants?.mb_image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                width: "562.38px",
                height: "480px",
              }}
            >
              <Box className="about_res_name">
                {chosenRestaurants?.mb_nick} Restaurant
              </Box>

              <Box className="about_res_info">
                {chosenRestaurants?.mb_description}
              </Box>
            </Stack>
            <Stack flexDirection={"column"}>
              <Stack className="about_res_box" flexDirection={"row"}>
                <img
                  className="res_Img"
                  src="/restaurant/about_res.png"
                  alt="restaurant img"
                />
                <Stack sx={{ ml: "20px", mt: "0px" }}>
                  <Box className="res_txt">Bizning moxir oshpazlarimiz.</Box>
                  <Box className="res_txt_des">
                    Lorem ipsum dolor sit amet, consectetuer <br /> adipiscing
                    elit, sed diam nonummy nibh...
                  </Box>
                </Stack>
              </Stack>
              <Stack
                className="about_res_box"
                flexDirection={"row"}
                sx={{ mt: "20px" }}
              >
                <img
                  className="res_Img"
                  src="/restaurant/about_res2.png"
                  alt="restaurant img"
                />
                <Stack sx={{ ml: "20px", mt: "0px" }}>
                  <Box className="res_txt">Bizning moxir oshpazlarimiz.</Box>
                  <Box className="res_txt_des">
                    Lorem ipsum dolor sit amet, consectetuer <br /> adipiscing
                    elit, sed diam nonummy nibh...
                  </Box>
                </Stack>
              </Stack>
              <Stack
                className="about_res_box"
                flexDirection={"row"}
                sx={{ mt: "20px" }}
              >
                <img
                  className="res_Img"
                  src="/restaurant/about_res3.png"
                  alt="restaurant img"
                />
                <Stack sx={{ ml: "20px", mt: "0px" }}>
                  <Box className="res_txt">Bizning moxir oshpazlarimiz.</Box>
                  <Box className="res_txt_des">
                    Lorem ipsum dolor sit amet, consectetuer <br /> adipiscing
                    elit, sed diam nonummy nibh...
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Box className="about_res_title">Oshxona Manzili</Box>
          <Stack sx={{ mb: "50px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.4377562746317!2d69.22631931677766!3d41.321093427628114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b9a0a33281d%3A0x9c5015eab678e435!2z0KDQsNC50YXQvtC9!5e0!3m2!1sen!2skr!4v1700548643294!5m2!1sen!2skr"
              width="1200"
              height="600"
              style={{ border: "0" }}
              // allowfullscreen=""
              loading="lazy"
              // referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
