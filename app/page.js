"use client";
import React, { useEffect } from "react";
import { useVotingIntegrationstore } from "../store/Dvotingstore";
import { useRouter } from "next/navigation";
import Loader from "./loader/Page";

const Page = () => {
  const { isOwner, isLoading } = useVotingIntegrationstore();
  const router = useRouter();

  useEffect(() => {
    console.log("owner", isOwner);
    const InitializeContract = async () => {
      if (isOwner) {
        router.push("/candidateaddition");
      } else {
        router.push("/castvote");
      }
    };
    InitializeContract();
  }, [isOwner]);

  return <>{isLoading && <Loader />}</>;
};

export default Page;
