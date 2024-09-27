"use client";
import React, { useEffect } from "react";
import { useVotingIntegrationstore } from "../store/Dvotingstore";
import { useRouter } from "next/navigation";
import Loader from "./loader/Page";

const Page = () => {
  const { isOwner, contract } = useVotingIntegrationstore();
  const router = useRouter();

  useEffect(() => {
    const InitializeContract = async () => {
      if (isOwner) {
        router.push("/candidateaddition");
      } else {
        router.push("/castvote");
      }
    };
    InitializeContract();
  }, [isOwner]);

  return <>{contract && <Loader />}</>;
};

export default Page;
