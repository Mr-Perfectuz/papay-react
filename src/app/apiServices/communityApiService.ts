
import axios from "axios";
import { serviceApi } from "../../lib/config";
import assert from "assert";
import { Definer } from "../../lib/Definer";
import { BoArticle, SearchArticleObj, SearchMemberArticleObj } from "../../types/boArticles";

class CommunityApiService {
    private readonly path: string;

    constructor(){
        this.path = serviceApi;
    }

    public async getTargetArticles(data: SearchArticleObj): Promise<BoArticle[]>{
    try {

        // let url = `/community/target?bo_id=${data.bo_id}&page=${data.page}&limit=${data.limit}`;
        let url = `/community/target?bo_id=${data.bo_id}&page=${data.page}&limit=${data.limit}`;
        if(data.order) url += `&order=${data.order}`;

       const result =  await axios.get(this.path + url, {withCredentials: true});
           console.log("state: ", result.data.state);
            assert.ok(result?.data, Definer.general_err);
            assert.ok(result?.data?.state !== "fail", result?.data?.message);

        const articles: BoArticle[] = result.data.data;
        return articles;
    } catch (err: any) {  
      console.log(`ERROR: createOrder ${err.message}`);
      throw err;
         
    }
        }
    public async getMemberCommunityArticles(data: SearchMemberArticleObj): Promise<BoArticle[]>{
    try {

        let url = `/community/articles?mb_id=${data.mb_id}&page=${data.page}&limit=${data.limit}`;

       const result =  await axios.get(this.path + url, {withCredentials: true});
           console.log("state: ", result.data.state);
            assert.ok(result?.data, Definer.general_err);
            assert.ok(result?.data?.state !== "fail", result?.data?.message);

        const articles: BoArticle[] = result.data.data;
        return articles;
    } catch (err: any) {  
      console.log(`ERROR: createOrder ${err.message}`);
      throw err;
        
    }
        }
    public async getCHosenArticle(art_id: string): Promise<BoArticle>{
    try {

        let url = `/community/single-article/${art_id}`;

       const result =  await axios.get(this.path + url, {withCredentials: true});
           console.log("state: ", result.data.state);
            assert.ok(result?.data, Definer.general_err);
            assert.ok(result?.data?.state !== "fail", result?.data?.message);

        const article: BoArticle = result.data.data;
        return article;
    } catch (err: any) {  
      console.log(`ERROR: getCHosenArticle ${err.message}`);
      throw err;
        
    }
        }


    }

export default CommunityApiService;