import { SVGProps } from "react";

import Stamp1 from "@/assets/images/stamps/stamp-1.svg";
import Stamp10 from "@/assets/images/stamps/stamp-10.svg";
import Stamp11 from "@/assets/images/stamps/stamp-11.svg";
import Stamp12 from "@/assets/images/stamps/stamp-12.svg";
import Stamp2 from "@/assets/images/stamps/stamp-2.svg";
import Stamp3 from "@/assets/images/stamps/stamp-3.svg";
import Stamp4 from "@/assets/images/stamps/stamp-4.svg";
import Stamp5 from "@/assets/images/stamps/stamp-5.svg";
import Stamp6 from "@/assets/images/stamps/stamp-6.svg";
import Stamp7 from "@/assets/images/stamps/stamp-7.svg";
import Stamp8 from "@/assets/images/stamps/stamp-8.svg";
import Stamp9 from "@/assets/images/stamps/stamp-9.svg";

export const getStamp = ({
  id,
}: {
  id: number;
}): React.FC<SVGProps<SVGSVGElement>> => {
  let stamp: React.FC<SVGProps<SVGSVGElement>>;
  switch (id) {
    case 1:
      stamp = Stamp1;
      break;
    case 2:
      stamp = Stamp2;
      break;
    case 3:
      stamp = Stamp3;
      break;
    case 4:
      stamp = Stamp4;
      break;
    case 5:
      stamp = Stamp5;
      break;
    case 6:
      stamp = Stamp6;
      break;
    case 7:
      stamp = Stamp7;
      break;
    case 8:
      stamp = Stamp8;
      break;
    case 9:
      stamp = Stamp9;
      break;
    case 10:
      stamp = Stamp10;
      break;
    case 11:
      stamp = Stamp11;
      break;
    case 12:
      stamp = Stamp12;
      break;
    default:
      stamp = Stamp1;
  }
  return stamp;
};
