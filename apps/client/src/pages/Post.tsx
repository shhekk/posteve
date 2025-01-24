import { Button } from '@mui/material';
import { customFetch } from '@posteve/utils/fetch/customFetch';

export function Post() {
  const postHandler = async () => {
    const res = await customFetch('/api/post/hello/linked');
    console.log({ postRes: res });
    //does not support platform: linked
  };
  return (
    <>
      <div>
        "home -- post details on claendarrrr"
        "connect -- connect "
        "post -- upload and schedule post"
        <Button onClick={postHandler}>post</Button>
      </div>
    </>
  );
}
