import React from "react";
import { Box, Button, Stack } from "@mui/material";

const following = [
  {
    mb_nick: "@ilkhom9601",
    name: "Temirov Ilkhom",
    following: true,
    img: "/images/ilkhom.svg",
  },
  {
    mb_nick: "@john2909",
    name: "Jonibek Buronov",
    following: true,
    img: "/images/john.svg",
  },
  {
    mb_nick: "@umka",
    name: "Umida Juraeva",
    following: true,
    img: "/images/umka.svg",
  },
];
export default function MemberFollowing(props: any) {
  return (
    <Stack>
      {following?.map((following) => {
        return (
          <Stack>
            <Stack className="followers_target_articles" flexDirection={"row"}>
              <Box className="followers_img">
                <img src={following.img} alt="article" />
              </Box>
              <Stack
                className="followers_target_articles_wrapper"
                flexDirection={"row"}
              >
                <Stack>
                  <Stack flexDirection={"row"} alignItems={"center"}>
                    <Box className="followers_user_name">
                      {following.mb_nick}
                    </Box>
                  </Stack>

                  <Box className="followers_target_articles_text">
                    {following.name}
                  </Box>
                </Stack>

                <Stack>
                  {props.actions_enabled && (
                    <Button
                      variant="contained"
                      className="cancel_following_btn"
                    >
                      <img src="/icons/followback.svg" alt="followback img" />
                      <span>Bekor qilish</span>
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
