import React from "react";
import Link from "next/link";
import {
  useGetCtcDataQuery,
  useGetCtcTextQuery,
} from "@/store/global-store/global.query";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const CtcSection: React.FC = () => {
  const {
    data: ctcData,
    isLoading: ctcDataLoading,
    isError,
  } = useGetCtcDataQuery();
  const { data: ctctext, isLoading: ctctextLoading } = useGetCtcTextQuery();
  const { push } = useRouter();

  const viewJobHandler = (id: number) => {
    push(`/browse-job-filter?jobId=${id}`);
  };
  return (
    <>
      {ctcDataLoading && ctctextLoading && <Loading />}
      <div
        style={{ backgroundColor: "#F3F3F3" }}
        className="section-full content-inner"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 section-head text-center">
              <h2 style={{ fontWeight: "600" }} className="m-b5">
                {ctctext?.data?.heading}
              </h2>
              <h6 className="fw4 m-b0"> {ctctext?.data?.description} </h6>
            </div>
          </div>
          <div className="row ctc-jobs-wrap">
            {ctcData?.data?.map((text, index) => (
              <div
                key={index}
                className="pricingtable-wrapper style2 bg-white member-ship-div ctc-based-jobs-wrap"
                style={{
                  minHeight: "270px",
                  borderRadius: "20px",
                  position: "relative",
                  margin: "10px",
                }}
                onMouseEnter={(e) => {
                  const button = e.currentTarget.querySelector(
                    ".site-button"
                  ) as HTMLElement;
                  if (button) {
                    button.style.backgroundColor = "#fff";
                    button.style.color = "#000";
                  }
                }}
                onMouseLeave={(e) => {
                  const button = e.currentTarget.querySelector(
                    ".site-button"
                  ) as HTMLElement;
                  if (button) {
                    button.style.backgroundColor = "#2A6310";
                    button.style.color = "#fff";
                  }
                }}
              >
                <div className="">
                  <div className="pricingtable-price">
                    <h4
                      className="font-weight-900 m-t10 m-b0 text-center ctc-border"
                      style={{
                        fontWeight: "bold",
                        fontSize: "28px",
                        borderRadius: "20px",
                        padding: "5px",
                      }}
                    >
                      CTC
                    </h4>
                  </div>
                  <ul style={{ marginTop: "40px" }} className="mp-cards">
                    <li
                      style={{
                        color: "black",
                        margin: "5px 0px",
                        fontSize: "18px",
                      }}
                    >
                      <b>{text?.title}</b>
                      <br />
                      <p>{text?.jobs_count} Jobs</p>
                    </li>
                  </ul>
                  <div className="text-center">
                    <div
                      className="site-button radius-xl white-hover"
                      style={{
                        border: "1px solid white",
                        backgroundColor: "#2A6310",
                      }}
                    >
                      <span
                        className="p-lr30"
                        style={{ fontFamily: "__Inter_Fallback_aaf875" }}
                        onClick={() => viewJobHandler(text?.id)}
                      >
                        View Jobs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CtcSection;
