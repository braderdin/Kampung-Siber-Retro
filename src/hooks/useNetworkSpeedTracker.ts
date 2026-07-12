import { useState, useEffect } from "react";

type NetworkSpeedInfo = {
  type: string;
  speed: number;
  label: string;
};

export function useNetworkSpeedTracker() {
  const [speedInfo, setSpeedInfo] = useState<NetworkSpeedInfo>({
    type: "unknown",
    speed: 0,
    label: "Detecting...",
  });

  useEffect(() => {
    const getNetworkInfo = () => {
      if (typeof navigator !== "undefined" && (navigator as any).connection) {
        const conn = (navigator as any).connection;
        const downlink = conn.downlink || 0;
        const effectiveType = conn.effectiveType || "unknown";
        
        let label = "";
        let speed = downlink;

        switch (effectiveType) {
          case "slow-2g":
          case "2g":
            label = "2G Modem Mode";
            speed = 0.064;
            break;
          case "3g":
            label = "3G Mobile Mode";
            speed = 0.1;
            break;
          case "4g":
            label = "4G LTE Mode";
            speed = 10;
            break;
          case "5g":
            label = "5G Ultra Mode";
            speed = 100;
            break;
          default:
            if (downlink < 0.115) {
              label = "Dial-up Mode";
              speed = 0.056;
            } else if (downlink < 0.3) {
              label = "ISDN Mode";
              speed = 0.128;
            } else if (downlink < 1) {
              label = "EDGE Mode";
              speed = 0.3;
            } else if (downlink < 10) {
              label = "3G Mode";
              speed = downlink;
            } else if (downlink < 50) {
              label = "4G LTE Mode";
              speed = downlink;
            } else if (downlink < 100) {
              label = "5G Mode";
              speed = downlink;
            } else {
              label = "Fiber Optic Mode";
              speed = downlink;
            }
        }

        setSpeedInfo({
          type: effectiveType,
          speed,
          label,
        });
      } else if (typeof navigator !== "undefined") {
        const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
        
        if (isMobile) {
          setSpeedInfo({
            type: "mobile",
            speed: 0.5,
            label: "Mobile Data Mode",
          });
        } else {
          setSpeedInfo({
            type: "wifi",
            speed: 100,
            label: "WiFi Mode",
          });
        }
      }
    };

    getNetworkInfo();

    if (typeof navigator !== "undefined" && (navigator as any).connection) {
      (navigator as any).connection.addEventListener("change", getNetworkInfo);
    }

    return () => {
      if (typeof navigator !== "undefined" && (navigator as any).connection) {
        (navigator as any).connection.removeEventListener("change", getNetworkInfo);
      }
    };
  }, []);

  return {
    ...speedInfo,
    isFast: speedInfo.speed > 10,
    isSlow: speedInfo.speed < 1,
  };
}

export default useNetworkSpeedTracker;
