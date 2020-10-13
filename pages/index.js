import { Box, Text } from "@chakra-ui/core";
import Layout from '../components/layout';

const Home = () => (
  <Layout>
    <Box my={5} mx={5} width="100%" align="center">
       <Text>This is an app to save questions on external api during a live stream </Text>
    <br/>
    <Text>Start your stream on <a href="http://restream.io">Restream.io</a> and then Sign in </Text>
    </Box>
  </Layout>
);

export default Home;
