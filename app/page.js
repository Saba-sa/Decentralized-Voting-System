"use client";
import React, { useEffect } from "react";
import { useVotingIntegrationstore } from "./Store/Votestore";
import { useRouter } from "next/navigation";
import Loader from "./loader/Page";

const Page = () => {
  const { isOwner, isLoading } = useVotingIntegrationstore();
  const router = useRouter();

  useEffect(() => {
    const InitializeContract = async () => {
      if (!isLoading) {
        if (isOwner) {
          router.push("/candidateaddition");
        } else {
          router.push("/castvote");
        }
      }
    };
    InitializeContract();
  }, [isOwner, isLoading, router]);

  return <>{isLoading && <Loader />}</>;
};

export default Page;
