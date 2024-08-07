"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Profilesidebar from "@/markup/Element/Profilesidebar";
import { useRouter } from "next/navigation";
import { useAuthToken } from "../../hooks/useAuthToken";
import Select, { SingleValue } from "react-select";
import { usePostProfileMutation } from "@/app/job-seeker/store/job-seeker.query";
import {
  useGetCollageQuery,
  useGetIndustryQuery,
  useGetDesignationQuery,
} from "@/store/global-store/global.query";
import { WritableProfileFormData } from "@/app/job-seeker/types/index";
import { toast } from "react-toastify";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import Loading from "@/components/Loading";
import { IMAGE_URL } from "@/lib/apiEndPoints";
import Image from "next/image";

interface OptionType {
  value: string;
  label: string;
  id: string;
}

const JobSeekerSection = () => {
  const { token } = useAuthToken();
  const { user, refetch } = useLoggedInUser();
  const router = useRouter();
  const { data: collageData, isLoading: collageDataLoading } =
    useGetCollageQuery();
  const { data: industryData, isLoading: industryDataLoading } =
    useGetIndustryQuery();
  const { data: designationData, isLoading: designationDataLoading } =
    useGetDesignationQuery();
  const [selectedCollege, setSelectedCollege] =
    useState<SingleValue<OptionType> | null>(null);
  const [selectedIndustry, setSelectedIndustry] =
    useState<SingleValue<OptionType> | null>(null);
  const [selectedDesignation, setSelectedDesignation] =
    useState<SingleValue<OptionType> | null>(null);
  const [postProfile] = usePostProfileMutation();
  const [resumeName, setResumeName] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [profileForm, setProfileForm] = useState<WritableProfileFormData>({
    name: "",
    email: "",
    mobile_number: "",
    college: "",
    designation: "",
    company_name: "",
    experience: "",
    country: "",
    expected_ctc: "",
    resume: null,
    location: "",
    industry: "",
    image: null,
  });

  useEffect(() => {
    if (user) {
      const collegeOptions: OptionType[] =
        collageData?.data?.map((college) => ({
          value: college.title,
          label: college.title,
          id: college.id.toString(),
        })) || [];

      const industryOptions: OptionType[] =
        industryData?.data?.map((industry) => ({
          value: industry.title,
          label: industry.title,
          id: industry.id.toString(),
        })) || [];

      const designationOptions: OptionType[] =
        designationData?.data?.map((designation) => ({
          value: designation.title,
          label: designation.title,
          id: designation.id.toString(),
        })) || [];

      setProfileForm({
        name: user.user.name || "",
        email: user.user.email || "",
        mobile_number: user.user.mobile_number || "",
        college: user.user.college_id?.toString() || "",
        designation: user.user.designation_id?.toString() || "",
        company_name: user.user.company_name || "",
        experience: user.user.experience || "",
        country: user.user.country || "",
        expected_ctc: user.user.expected_ctc || "",
        resume: user.user.resume || null,
        location: user.user.location || "",
        industry: user.user.industry_id?.toString() || "",
        image: user.user.image || null,
      });

      setSelectedCollege(
        collegeOptions.find(
          (option) => option.id === user.user.college_id?.toString()
        ) || null
      );
      setSelectedIndustry(
        industryOptions.find(
          (option) => option.id === user.user.industry_id?.toString()
        ) || null
      );
      setSelectedDesignation(
        designationOptions.find(
          (option) => option.id === user.user.designation_id?.toString()
        ) || null
      );

      if (user.user.resume) {
        setResumeName(user.user.resume);
      }
      if (user.user.image) {
        setImageName(user.user.image);
        setImagePreviewUrl(`${IMAGE_URL}/${user.user.image}`);
      }
    }
  }, [user, collageData, industryData, designationData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      if (name === "resume") {
        setProfileForm((prevForm) => ({ ...prevForm, resume: file }));
        setResumeName(file.name);
      } else if (name === "image") {
        setProfileForm((prevForm) => ({ ...prevForm, image: file }));
        setImageName(file.name);
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setProfileForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSelectChange = (
    name: string,
    selectedOption: SingleValue<OptionType> | null
  ) => {
    setProfileForm((prevForm) => ({
      ...prevForm,
      [name]: selectedOption ? selectedOption.id : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(profileForm).forEach(([key, value]) => {
      if (value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key === "resume" && typeof value === "string" && resumeName === value) {
          // Do not append existing resume URL if it is not a new file
        } else if (key === "image" && typeof value === "string" && imageName === value) {
          // Do not append existing image URL if it is not a new file
        } else {
          formData.append(key, value as string);
        }
      }
    });

    try {
      const res = await postProfile(formData).unwrap();
      toast.success(res?.message);
      refetch();
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      height: 38,
      minHeight: 38,
    }),
  };

  const collegeOptions: OptionType[] =
    collageData?.data?.map((college) => ({
      value: college.title,
      label: college.title,
      id: college.id.toString(),
    })) || [];

  const industryOptions: OptionType[] =
    industryData?.data?.map((industry) => ({
      value: industry.title,
      label: industry.title,
      id: industry.id.toString(),
    })) || [];

  const designationOptions: OptionType[] =
    designationData?.data?.map((designation) => ({
      value: designation.title,
      label: designation.title,
      id: designation.id.toString(),
    })) || [];

  const resumeUrl: any =
    profileForm.resume && profileForm.resume instanceof File
      ? URL.createObjectURL(profileForm?.resume)
      : profileForm.resume || "";
  const imageUrl =
    profileForm.image && profileForm.image instanceof File
      ? URL.createObjectURL(profileForm?.image)
      : `${IMAGE_URL}/${profileForm.image}` || "";

  useEffect(() => {
    return () => {
      if (resumeUrl && profileForm.resume instanceof File)
        URL.revokeObjectURL(resumeUrl);
      if (imagePreviewUrl && profileForm.image instanceof File)
        URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [resumeUrl, imagePreviewUrl]);

  return (
    <>
      {collageDataLoading && industryDataLoading && designationDataLoading && (
        <Loading />
      )}
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="section-full bg-white browse-job p-t50 p-b20">
            <div className="container">
              <div className="row">
                <Profilesidebar refetch={refetch} />
                <div className="col-xl-9 col-lg-8 m-b30">
                  <div className="job-bx job-profile">
                    <div className="job-bx-title clearfix">
                      <h5 className="font-weight-700 pull-left text-uppercase">
                        Basic Information
                      </h5>
                      <button
                      onClick={() => router.back()}
                      className="site-button right-arrow button-sm float-right"
                      style={{ fontFamily: "__Inter_Fallback_aaf875" }}
                    >
                      Back
                    </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="row m-b30">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Your Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Name"
                              name="name"
                              value={profileForm.name || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Email:</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Your Email"
                              name="email"
                              value={profileForm.email || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter Your Mobile Number"
                              name="mobile_number"
                              value={profileForm.mobile_number || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>College:</label>
                            <Select
                              styles={customStyles}
                              value={collegeOptions.find(
                                (option) => option.id === profileForm.college
                              )}
                              onChange={(option) =>
                                handleSelectChange("college", option)
                              }
                              options={collegeOptions}
                              placeholder="Select College"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Current Designation:</label>
                            <Select
                              styles={customStyles}
                              value={designationOptions.find(
                                (option) =>
                                  option.id === profileForm.designation
                              )}
                              onChange={(option) =>
                                handleSelectChange("designation", option)
                              }
                              options={designationOptions}
                              placeholder="Select Designation"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Company Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Company Name"
                              name="company_name"
                              value={profileForm.company_name || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Experience:</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter Experience"
                              name="experience"
                              value={profileForm.experience || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Country:</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Country"
                              name="country"
                              value={profileForm.country || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Expected CTC:</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Expected CTC (in lakhs)"
                              name="expected_ctc"
                              value={profileForm.expected_ctc || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Location:</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Location"
                              name="location"
                              value={profileForm.location || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Industry:</label>
                            <Select
                              styles={customStyles}
                              value={industryOptions.find(
                                (option) => option.id === profileForm.industry
                              )}
                              onChange={(option) =>
                                handleSelectChange("industry", option)
                              }
                              options={industryOptions}
                              placeholder="Select Industry"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Upload Resume:</label>
                            <input
                              type="file"
                              className="form-control"
                              name="resume"
                              onChange={handleInputChange}
                            />
                            {resumeName && (
                              <div className="mt-2">
                                <span>{resumeName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Upload Image:</label>
                            <input
                              type="file"
                              className="form-control"
                              name="image"
                              onChange={handleInputChange}
                            />
                            {imagePreviewUrl ? (
                              <div className="mt-2">
                                <Image
                                  src={imagePreviewUrl}
                                  alt="Profile"
                                  className="img-thumbnail"
                                  width={100}
                                  height={100}
                                  style={{ width: "35%" }}
                                />
                              </div>
                            ) : imageName ? (
                              <div className="mt-2">
                                <Image
                                  src={`${IMAGE_URL}/${imageName}`}
                                  alt="Profile"
                                  className="img-thumbnail"
                                  width={100}
                                  height={100}
                                  style={{ width: "35%" }}
                                />
                              </div>
                            ) : (
                              <div className="mt-2">
                                <span>No image uploaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="site-button">
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default JobSeekerSection;
