import VideoPlayer from "./client";

export default ({ params }) => {
  console.log("PAGE params:", params);
  const { id } = params;
  return <VideoPlayer id={id} />;
};
