import { WritableDraft } from "immer";
export interface Blog {
  id: number;
  parent_id: number;
  title: string;
  description: string;
  image: string;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse {
  code: number;
  success: boolean;
  message: string;
  data: Blog[];
}

export interface BlogsState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

export interface SectorState {
  sector: Sector[];
  sectorloading: boolean;
  sectorerror: string | null;
}

export interface RecentJobsState {
  recent: RecentJobResponse[];
  recentloading: boolean;
  recenterror: string | null;
}

export interface GetJobsState {
  jobs: RecentJobResponse[];
  jobsloading: boolean;
  jobserror: string | null;
}


export interface Event {
  map(arg0: (event: Event, index: number) => import("react").JSX.Element): import("react").ReactNode;
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface EventResponse {
  code: number;
  success: boolean;
  message: string;
  data: Event[];
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}




interface Sector {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SectorResponse {
  code: number;
  success: string;
  message: string;
  data: Sector[];
}



interface SingleBlogCommentPost {
    question_id : any;
    body : any;
    parent_comment_id?:string | null

}

type WritableSingleBlogCommentPost = WritableDraft<SingleBlogCommentPost>;

export {
  WritableSingleBlogCommentPost
}