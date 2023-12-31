import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Stack } from "@mui/material";
import React from "react";

//REDUX
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { retreiveProcessOrders } from "./selector";

//REDUX SELECTORS
const processOrdersRetriever = createSelector(
  retreiveProcessOrders,
  (processOrders) => ({ processOrders })
);

export default function ProcessedOrders() {
  /**  INITIALIZATION */

  // const { processOrders } = useSelector(processOrdersRetriever);

  const pausedOrders = [
    [1, 2, 3],
    [1, 2, 3],
  ];
  return (
    <TabPanel value="2">
      <Stack className="finishedOrder_wrapper">
        {pausedOrders?.map((order, index) => {
          return (
            <Box className="order_main_box" key={index}>
              <Box className="order_box_scroll">
                {order.map((item, index) => {
                  return (
                    <Stack flexDirection={"column"} key={index}>
                      <Stack className="orderDishBox" flexDirection={"row"}>
                        <Stack flexDirection={"row"} className="order_inside">
                          <img
                            src="/others/sandwich.png"
                            alt="sandwich img"
                            className="orderDishIasmg"
                          />
                          <Box className="titleDish">Sandwich</Box>
                        </Stack>
                        <Box className="dish_calc">
                          <span>$7</span>
                          <span>x3</span>
                          <span>=</span>
                          <span>$21</span>
                        </Box>
                      </Stack>
                    </Stack>
                  );
                })}
                <Stack
                  className="prossededOrders_dish_calc_extra"
                  flexDirection={"row"}
                >
                  <span>mahsulot narxi</span>
                  <span>$21</span>
                  <span>+</span>
                  <span>yetkazish xizmati</span>
                  <span>$2</span>
                  <span>=</span>
                  <span>jami narx</span>
                  <span>$23</span>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      borderRadius: "10px",
                      marginRight: "10px",
                      marginLeft: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    To'lash
                  </Button>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </TabPanel>
  );
}
