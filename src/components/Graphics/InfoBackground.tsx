import type { CSSProperties, FC } from 'react';

interface InfoBackgroundProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

// Decorative grid background used in info/instructions modals
export const InfoBackground: FC<InfoBackgroundProps> = ({ width = '100%', height = 'auto', className, style }) => (
  <svg
    width={typeof width === 'number' ? width : undefined}
    height={typeof height === 'number' ? height : undefined}
    viewBox="0 0 392 216"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: typeof width === 'string' ? width : undefined, height: typeof height === 'string' ? height : undefined, display: 'block', ...style }}
  >
    <mask id="path-1-inside-1_452_3492" fill="white">
      <path d="M-39 -261H1V-221H-39V-261Z"/>
      <path d="M-39 -183H1V-143H-39V-183Z"/>
      <path d="M-39 -105H1V-65H-39V-105Z"/>
      <path d="M-39 -27H1V13H-39V-27Z"/>
      <path d="M-39 51H1V91H-39V51Z"/>
      <path d="M-39 129H1V169H-39V129Z"/>
      <path d="M-39 207H1V247H-39V207Z"/>
      <path d="M-39 285H1V325H-39V285Z"/>
      <path d="M-39 363H1V403H-39V363Z"/>
      <path d="M-39 441H1V481H-39V441Z"/>
      <path d="M-39 519H1V559H-39V519Z"/>
      <path d="M-39 597H1V637H-39V597Z"/>
      <path d="M-39 -222H1V-182H-39V-222Z"/>
      <path d="M-39 -144H1V-104H-39V-144Z"/>
      <path d="M-39 -66H1V-26H-39V-66Z"/>
      <path d="M-39 12H1V52H-39V12Z"/>
      <path d="M-39 90H1V130H-39V90Z"/>
      <path d="M-39 168H1V208H-39V168Z"/>
      <path d="M-39 246H1V286H-39V246Z"/>
      <path d="M-39 324H1V364H-39V324Z"/>
      <path d="M-39 402H1V442H-39V402Z"/>
      <path d="M-39 480H1V520H-39V480Z"/>
      <path d="M-39 558H1V598H-39V558Z"/>
      <path d="M-39 636H1V676H-39V636Z"/>
      <path d="M0 -261H40V-221H0V-261Z"/>
      <path d="M0 -183H40V-143H0V-183Z"/>
      <path d="M0 -105H40V-65H0V-105Z"/>
      <path d="M0 -27H40V13H0V-27Z"/>
      <path d="M0 51H40V91H0V51Z"/>
      <path d="M0 129H40V169H0V129Z"/>
      <path d="M0 207H40V247H0V207Z"/>
      <path d="M0 285H40V325H0V285Z"/>
      <path d="M0 363H40V403H0V363Z"/>
      <path d="M0 441H40V481H0V441Z"/>
      <path d="M0 519H40V559H0V519Z"/>
      <path d="M0 597H40V637H0V597Z"/>
      <path d="M0 -222H40V-182H0V-222Z"/>
      <path d="M0 -144H40V-104H0V-144Z"/>
      <path d="M0 -66H40V-26H0V-66Z"/>
      <path d="M0 12H40V52H0V12Z"/>
      <path d="M0 90H40V130H0V90Z"/>
      <path d="M0 168H40V208H0V168Z"/>
      <path d="M0 246H40V286H0V246Z"/>
      <path d="M0 324H40V364H0V324Z"/>
      <path d="M0 402H40V442H0V402Z"/>
      <path d="M0 480H40V520H0V480Z"/>
      <path d="M0 558H40V598H0V558Z"/>
      <path d="M0 636H40V676H0V636Z"/>
      <path d="M39 -261H79V-221H39V-261Z"/>
      <path d="M39 -183H79V-143H39V-183Z"/>
      <path d="M39 -105H79V-65H39V-105Z"/>
      <path d="M39 -27H79V13H39V-27Z"/>
      <path d="M39 51H79V91H39V51Z"/>
      <path d="M39 129H79V169H39V129Z"/>
      <path d="M39 207H79V247H39V207Z"/>
      <path d="M39 285H79V325H39V285Z"/>
      <path d="M39 363H79V403H39V363Z"/>
      <path d="M39 441H79V481H39V441Z"/>
      <path d="M39 519H79V559H39V519Z"/>
      <path d="M39 597H79V637H39V597Z"/>
      <path d="M39 -222H79V-182H39V-222Z"/>
      <path d="M39 -144H79V-104H39V-144Z"/>
      <path d="M39 -66H79V-26H39V-66Z"/>
      <path d="M39 12H79V52H39V12Z"/>
      <path d="M39 90H79V130H39V90Z"/>
      <path d="M39 168H79V208H39V168Z"/>
      <path d="M39 246H79V286H39V246Z"/>
      <path d="M39 324H79V364H39V324Z"/>
      <path d="M39 402H79V442H39V402Z"/>
      <path d="M39 480H79V520H39V480Z"/>
      <path d="M39 558H79V598H39V558Z"/>
      <path d="M39 636H79V676H39V636Z"/>
      <path d="M78 -261H118V-221H78V-261Z"/>
      <path d="M78 -183H118V-143H78V-183Z"/>
      <path d="M78 -105H118V-65H78V-105Z"/>
      <path d="M78 -27H118V13H78V-27Z"/>
      <path d="M78 51H118V91H78V51Z"/>
      <path d="M78 129H118V169H78V129Z"/>
      <path d="M78 207H118V247H78V207Z"/>
      <path d="M78 285H118V325H78V285Z"/>
      <path d="M78 363H118V403H78V363Z"/>
      <path d="M78 441H118V481H78V441Z"/>
      <path d="M78 519H118V559H78V519Z"/>
      <path d="M78 597H118V637H78V597Z"/>
      <path d="M78 -222H118V-182H78V-222Z"/>
      <path d="M78 -144H118V-104H78V-144Z"/>
      <path d="M78 -66H118V-26H78V-66Z"/>
      <path d="M78 12H118V52H78V12Z"/>
      <path d="M78 90H118V130H78V90Z"/>
      <path d="M78 168H118V208H78V168Z"/>
      <path d="M78 246H118V286H78V246Z"/>
      <path d="M78 324H118V364H78V324Z"/>
      <path d="M78 402H118V442H78V402Z"/>
      <path d="M78 480H118V520H78V480Z"/>
      <path d="M78 558H118V598H78V558Z"/>
      <path d="M78 636H118V676H78V636Z"/>
      <path d="M117 -261H157V-221H117V-261Z"/>
      <path d="M117 -183H157V-143H117V-183Z"/>
      <path d="M117 -105H157V-65H117V-105Z"/>
      <path d="M117 -27H157V13H117V-27Z"/>
      <path d="M117 51H157V91H117V51Z"/>
      <path d="M117 129H157V169H117V129Z"/>
      <path d="M117 207H157V247H117V207Z"/>
      <path d="M117 285H157V325H117V285Z"/>
      <path d="M117 363H157V403H117V363Z"/>
      <path d="M117 441H157V481H117V441Z"/>
      <path d="M117 519H157V559H117V519Z"/>
      <path d="M117 597H157V637H117V597Z"/>
      <path d="M117 -222H157V-182H117V-222Z"/>
      <path d="M117 -144H157V-104H117V-144Z"/>
      <path d="M117 -66H157V-26H117V-66Z"/>
      <path d="M117 12H157V52H117V12Z"/>
      <path d="M117 90H157V130H117V90Z"/>
      <path d="M117 168H157V208H117V168Z"/>
      <path d="M117 246H157V286H117V246Z"/>
      <path d="M117 324H157V364H117V324Z"/>
      <path d="M117 402H157V442H117V402Z"/>
      <path d="M117 480H157V520H117V480Z"/>
      <path d="M117 558H157V598H117V558Z"/>
      <path d="M117 636H157V676H117V636Z"/>
      <path d="M156 -261H196V-221H156V-261Z"/>
      <path d="M156 -183H196V-143H156V-183Z"/>
      <path d="M156 -105H196V-65H156V-105Z"/>
      <path d="M156 -27H196V13H156V-27Z"/>
      <path d="M156 51H196V91H156V51Z"/>
      <path d="M156 129H196V169H156V129Z"/>
      <path d="M156 207H196V247H156V207Z"/>
      <path d="M156 285H196V325H156V285Z"/>
      <path d="M156 363H196V403H156V363Z"/>
      <path d="M156 441H196V481H156V441Z"/>
      <path d="M156 519H196V559H156V519Z"/>
      <path d="M156 597H196V637H156V597Z"/>
      <path d="M156 -222H196V-182H156V-222Z"/>
      <path d="M156 -144H196V-104H156V-144Z"/>
      <path d="M156 -66H196V-26H156V-66Z"/>
      <path d="M156 12H196V52H156V12Z"/>
      <path d="M156 90H196V130H156V90Z"/>
      <path d="M156 168H196V208H156V168Z"/>
      <path d="M156 246H196V286H156V246Z"/>
      <path d="M156 324H196V364H156V324Z"/>
      <path d="M156 402H196V442H156V402Z"/>
      <path d="M156 480H196V520H156V480Z"/>
      <path d="M156 558H196V598H156V558Z"/>
      <path d="M156 636H196V676H156V636Z"/>
      <path d="M195 -261H235V-221H195V-261Z"/>
      <path d="M195 -183H235V-143H195V-183Z"/>
      <path d="M195 -105H235V-65H195V-105Z"/>
      <path d="M195 -27H235V13H195V-27Z"/>
      <path d="M195 51H235V91H195V51Z"/>
      <path d="M195 129H235V169H195V129Z"/>
      <path d="M195 207H235V247H195V207Z"/>
      <path d="M195 285H235V325H195V285Z"/>
      <path d="M195 363H235V403H195V363Z"/>
      <path d="M195 441H235V481H195V441Z"/>
      <path d="M195 519H235V559H195V519Z"/>
      <path d="M195 597H235V637H195V597Z"/>
      <path d="M195 -222H235V-182H195V-222Z"/>
      <path d="M195 -144H235V-104H195V-144Z"/>
      <path d="M195 -66H235V-26H195V-66Z"/>
      <path d="M195 12H235V52H195V12Z"/>
      <path d="M195 90H235V130H195V90Z"/>
      <path d="M195 168H235V208H195V168Z"/>
      <path d="M195 246H235V286H195V246Z"/>
      <path d="M195 324H235V364H195V324Z"/>
      <path d="M195 402H235V442H195V402Z"/>
      <path d="M195 480H235V520H195V480Z"/>
      <path d="M195 558H235V598H195V558Z"/>
      <path d="M195 636H235V676H195V636Z"/>
      <path d="M234 -261H274V-221H234V-261Z"/>
      <path d="M234 -183H274V-143H234V-183Z"/>
      <path d="M234 -105H274V-65H234V-105Z"/>
      <path d="M234 -27H274V13H234V-27Z"/>
      <path d="M234 51H274V91H234V51Z"/>
      <path d="M234 129H274V169H234V129Z"/>
      <path d="M234 207H274V247H234V207Z"/>
      <path d="M234 285H274V325H234V285Z"/>
      <path d="M234 363H274V403H234V363Z"/>
      <path d="M234 441H274V481H234V441Z"/>
      <path d="M234 519H274V559H234V519Z"/>
      <path d="M234 597H274V637H234V597Z"/>
      <path d="M234 -222H274V-182H234V-222Z"/>
      <path d="M234 -144H274V-104H234V-144Z"/>
      <path d="M234 -66H274V-26H234V-66Z"/>
      <path d="M234 12H274V52H234V12Z"/>
      <path d="M234 90H274V130H234V90Z"/>
      <path d="M234 168H274V208H234V168Z"/>
      <path d="M234 246H274V286H234V246Z"/>
      <path d="M234 324H274V364H234V324Z"/>
      <path d="M234 402H274V442H234V402Z"/>
      <path d="M234 480H274V520H234V480Z"/>
      <path d="M234 558H274V598H234V558Z"/>
      <path d="M234 636H274V676H234V636Z"/>
      <path d="M273 -261H313V-221H273V-261Z"/>
      <path d="M273 -183H313V-143H273V-183Z"/>
      <path d="M273 -105H313V-65H273V-105Z"/>
      <path d="M273 -27H313V13H273V-27Z"/>
      <path d="M273 51H313V91H273V51Z"/>
      <path d="M273 129H313V169H273V129Z"/>
      <path d="M273 207H313V247H273V207Z"/>
      <path d="M273 285H313V325H273V285Z"/>
      <path d="M273 363H313V403H273V363Z"/>
      <path d="M273 441H313V481H273V441Z"/>
      <path d="M273 519H313V559H273V519Z"/>
      <path d="M273 597H313V637H273V597Z"/>
      <path d="M273 -222H313V-182H273V-222Z"/>
      <path d="M273 -144H313V-104H273V-144Z"/>
      <path d="M273 -66H313V-26H273V-66Z"/>
      <path d="M273 12H313V52H273V12Z"/>
      <path d="M273 90H313V130H273V90Z"/>
      <path d="M273 168H313V208H273V168Z"/>
      <path d="M273 246H313V286H273V246Z"/>
      <path d="M273 324H313V364H273V324Z"/>
      <path d="M273 402H313V442H273V402Z"/>
      <path d="M273 480H313V520H273V480Z"/>
      <path d="M273 558H313V598H273V558Z"/>
      <path d="M273 636H313V676H273V636Z"/>
      <path d="M312 -261H352V-221H312V-261Z"/>
      <path d="M351 -261H391V-221H351V-261Z"/>
      <path d="M390 -261H430V-221H390V-261Z"/>
      <path d="M312 -183H352V-143H312V-183Z"/>
      <path d="M351 -183H391V-143H351V-183Z"/>
      <path d="M390 -183H430V-143H390V-183Z"/>
      <path d="M312 -105H352V-65H312V-105Z"/>
      <path d="M351 -105H391V-65H351V-105Z"/>
      <path d="M390 -105H430V-65H390V-105Z"/>
      <path d="M312 -27H352V13H312V-27Z"/>
      <path d="M351 -27H391V13H351V-27Z"/>
      <path d="M390 -27H430V13H390V-27Z"/>
      <path d="M312 51H352V91H312V51Z"/>
      <path d="M351 51H391V91H351V51Z"/>
      <path d="M390 51H430V91H390V51Z"/>
      <path d="M312 129H352V169H312V129Z"/>
      <path d="M351 129H391V169H351V129Z"/>
      <path d="M390 129H430V169H390V129Z"/>
      <path d="M312 207H352V247H312V207Z"/>
      <path d="M351 207H391V247H351V207Z"/>
      <path d="M390 207H430V247H390V207Z"/>
      <path d="M312 285H352V325H312V285Z"/>
      <path d="M351 285H391V325H351V285Z"/>
      <path d="M390 285H430V325H390V285Z"/>
      <path d="M312 363H352V403H312V363Z"/>
      <path d="M351 363H391V403H351V363Z"/>
      <path d="M390 363H430V403H390V363Z"/>
      <path d="M312 441H352V481H312V441Z"/>
      <path d="M351 441H391V481H351V441Z"/>
      <path d="M390 441H430V481H390V441Z"/>
      <path d="M312 519H352V559H312V519Z"/>
      <path d="M351 519H391V559H351V519Z"/>
      <path d="M390 519H430V559H390V519Z"/>
      <path d="M312 597H352V637H312V597Z"/>
      <path d="M351 597H391V637H351V597Z"/>
      <path d="M390 597H430V637H390V597Z"/>
      <path d="M312 -222H352V-182H312V-222Z"/>
      <path d="M351 -222H391V-182H351V-222Z"/>
      <path d="M390 -222H430V-182H390V-222Z"/>
      <path d="M312 -144H352V-104H312V-144Z"/>
      <path d="M351 -144H391V-104H351V-144Z"/>
      <path d="M390 -144H430V-104H390V-144Z"/>
      <path d="M312 -66H352V-26H312V-66Z"/>
      <path d="M351 -66H391V-26H351V-66Z"/>
      <path d="M390 -66H430V-26H390V-66Z"/>
      <path d="M312 12H352V52H312V12Z"/>
      <path d="M351 12H391V52H351V12Z"/>
      <path d="M390 12H430V52H390V12Z"/>
      <path d="M312 90H352V130H312V90Z"/>
      <path d="M351 90H391V130H351V90Z"/>
      <path d="M390 90H430V130H390V90Z"/>
      <path d="M312 168H352V208H312V168Z"/>
      <path d="M351 168H391V208H351V168Z"/>
      <path d="M390 168H430V208H390V168Z"/>
      <path d="M312 246H352V286H312V246Z"/>
      <path d="M351 246H391V286H351V246Z"/>
      <path d="M390 246H430V286H390V246Z"/>
      <path d="M312 324H352V364H312V324Z"/>
      <path d="M351 324H391V364H351V324Z"/>
      <path d="M390 324H430V364H390V324Z"/>
      <path d="M312 402H352V442H312V402Z"/>
      <path d="M351 402H391V442H351V402Z"/>
      <path d="M390 402H430V442H390V402Z"/>
      <path d="M312 480H352V520H312V480Z"/>
      <path d="M351 480H391V520H351V480Z"/>
      <path d="M390 480H430V520H390V480Z"/>
      <path d="M312 558H352V598H312V558Z"/>
      <path d="M351 558H391V598H351V558Z"/>
      <path d="M390 558H430V598H390V558Z"/>
      <path d="M312 636H352V676H312V636Z"/>
      <path d="M351 636H391V676H351V636Z"/>
      <path d="M390 636H430V676H390V636Z"/>
    </mask>
    {Array.from({ length: 288 }).map((_, idx) => (
      <path key={idx} d="" />
    ))}
    <g filter="url(#filter0_f_452_3492)">
      <path d="M101 241.379C101 284.8 75.4802 320 44 320C12.5198 320 -13 284.8 -13 241.379C-13 197.958 12.5198 162.759 44 162.759C75.4802 162.759 101 197.958 101 241.379Z" fill="#244AAB"/>
      <path d="M209 64.8276C209 92.2514 192.882 114.483 173 114.483C153.118 114.483 137 92.2514 137 64.8276C137 37.4038 153.118 15.1724 173 15.1724C192.882 15.1724 209 37.4038 209 64.8276Z" fill="#244AAB"/>
      <path d="M268 148.276C268 167.701 256.583 183.448 242.5 183.448C228.417 183.448 217 167.701 217 148.276C217 128.851 228.417 113.103 242.5 113.103C256.583 113.103 268 128.851 268 148.276Z" fill="#244AAB"/>
      <path d="M57 66.2069C57 82.2041 47.598 95.1724 36 95.1724C24.402 95.1724 15 82.2041 15 66.2069C15 50.2097 24.402 37.2414 36 37.2414C47.598 37.2414 57 50.2097 57 66.2069Z" fill="#244AAB"/>
      <path d="M407 37.2414C407 57.8092 394.912 74.4828 380 74.4828C365.088 74.4828 353 57.8092 353 37.2414C353 16.6735 365.088 0 380 0C394.912 0 407 16.6735 407 37.2414Z" fill="#244AAB"/>
      <path d="M346 246.897C346 281.938 325.405 310.345 300 310.345C274.595 310.345 254 281.938 254 246.897C254 211.855 274.595 183.448 300 183.448C325.405 183.448 346 211.855 346 246.897Z" fill="#244AAB"/>
    </g>
    <defs>
      <filter id="filter0_f_452_3492" x="-137.7" y="-124.7" width="669.4" height="569.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="62.35" result="effect1_foregroundBlur_452_3492"/>
      </filter>
    </defs>
  </svg>
);


