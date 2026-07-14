import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell, Weight, Utensils, Zap, BarChart3, Droplets,
  Heart, PieChart, Plus, Minus, Search, ChevronDown, Stethoscope,
  PersonStanding, Check,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { RealMuscleMap, getColor } from '@/components/landing/MuscleMapSection';

// ---------------------------------------------------------------------------
// CoachDashboardPreview — the flagship /coaches proof. A faithful, interactive
// recreation of the real RYZN "Teammate" detail screen a coach sees when they
// tap an athlete: season score, auto-verified stats, muscle focus, coach
// insights, assignable macros, deep-dive tabs. Coaches toggle between three
// mock athletes; switching morphs every value IN PLACE (numbers count, rings
// re-fill, bars re-height) rather than a full fade. The phone matches the
// house frame + the app's own dark-gray surface, and scrolls with a custom
// draggable scrollbar on the right edge.
// ---------------------------------------------------------------------------

const BLUE = '#0A84FF';
const APP_BG = '#0D0D0F';
const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

type Emphasis = Record<string, number>;
type Macros = { calories: number; protein: number; carbs: number; fat: number };

type Athlete = {
  id: string;
  name: string;
  first: string;
  initials: string;
  position: string;
  grad: [string, string];
  score: number;
  workouts: number;
  volume: number;
  daysLogged: number;
  avgProtein: number;
  volPerWorkout: number;
  loggingRate: number;
  foodScore: number;
  consistency: number;
  avgHR: number;
  front: Emphasis;
  back: Emphasis;
  macros: Macros;
  nutrition: number[];
  workoutsBars: number[];
  lifts: { name: string; value: number; trend: number[] }[];
};

const ATHLETES: Athlete[] = [
  {
    id: 'marcus', name: 'Marcus Bell', first: 'Marcus', initials: 'MB', position: 'RB · #22',
    grad: ['#2563eb', '#1e40af'], score: 84,
    workouts: 47, volume: 214600, daysLogged: 58, avgProtein: 172, volPerWorkout: 4570, loggingRate: 91,
    foodScore: 79, consistency: 88, avgHR: 148,
    front: { shoulders: 1, chest: 1, arms: 1, forearms: 1, core: 2, upper_back: 1, quads: 3 },
    back: { lats: 1, rear_delts: 1, triceps: 1, forearms: 1, lower_back: 2, upper_back: 1, hamstrings: 3, glutes: 3, calves: 2 },
    macros: { calories: 3200, protein: 195, carbs: 360, fat: 90 },
    nutrition: [3100, 3260, 2980, 3340, 3180, 2890, 3220],
    workoutsBars: [38, 52, 44, 61, 49, 57],
    lifts: [
      { name: 'Back Squat', value: 405, trend: [355, 365, 380, 390, 405] },
      { name: 'Power Clean', value: 245, trend: [215, 225, 230, 240, 245] },
      { name: 'Bench Press', value: 275, trend: [245, 255, 260, 270, 275] },
    ],
  },
  {
    id: 'diego', name: 'Diego Torres', first: 'Diego', initials: 'DT', position: 'WR · #10',
    grad: ['#16a34a', '#065f46'], score: 76,
    workouts: 39, volume: 168200, daysLogged: 51, avgProtein: 158, volPerWorkout: 4310, loggingRate: 84,
    foodScore: 82, consistency: 80, avgHR: 156,
    front: { shoulders: 2, chest: 2, arms: 2, forearms: 1, core: 2, upper_back: 1, quads: 2 },
    back: { lats: 2, rear_delts: 2, triceps: 2, forearms: 1, lower_back: 1, upper_back: 2, hamstrings: 2, glutes: 2, calves: 2 },
    macros: { calories: 2850, protein: 180, carbs: 300, fat: 78 },
    nutrition: [2790, 2910, 2680, 2950, 2830, 2710, 2880],
    workoutsBars: [30, 41, 36, 47, 39, 43],
    lifts: [
      { name: 'Trap Bar DL', value: 365, trend: [315, 330, 340, 355, 365] },
      { name: 'Bench Press', value: 235, trend: [205, 215, 220, 230, 235] },
      { name: 'Front Squat', value: 285, trend: [245, 255, 265, 275, 285] },
    ],
  },
  {
    id: 'tyler', name: 'Tyler Nguyen', first: 'Tyler', initials: 'TN', position: 'LB · #45',
    grad: ['#f97316', '#b45309'], score: 91,
    workouts: 54, volume: 262400, daysLogged: 63, avgProtein: 188, volPerWorkout: 4860, loggingRate: 95,
    foodScore: 90, consistency: 93, avgHR: 141,
    front: { shoulders: 3, chest: 3, arms: 2, forearms: 2, core: 2, upper_back: 2, quads: 3 },
    back: { lats: 3, rear_delts: 3, triceps: 2, forearms: 2, lower_back: 2, upper_back: 3, hamstrings: 2, glutes: 2, calves: 1 },
    macros: { calories: 3450, protein: 210, carbs: 380, fat: 95 },
    nutrition: [3420, 3510, 3380, 3460, 3400, 3290, 3480],
    workoutsBars: [44, 58, 51, 66, 55, 62],
    lifts: [
      { name: 'Back Squat', value: 455, trend: [405, 420, 435, 445, 455] },
      { name: 'Deadlift', value: 495, trend: [435, 455, 470, 485, 495] },
      { name: 'Bench Press', value: 315, trend: [275, 290, 300, 310, 315] },
    ],
  },
];

const fmtVol = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

// Posterior figure — the REAL anatomical back paths ported straight from the
// RYZN iOS app (MuscleMapBackView, male silhouette). Each SVG group maps onto
// the athlete.back heat keys so the same data colors it. viewBox uses the app's
// back crop (330 80 300 560) so the full posterior chain renders.
const BACK_MUSCLE_PATHS: { id: string; group: string; d: string }[] = [
  { id: 'mb_spine_right', group: 'upper_back', d: 'm485.74503 99.88413c3.6417236 3.6412964 5.550293 25.317154 13.527557 33.29397c7.977234 7.9768066 32.750183 8.4973755 34.335938 14.566925c1.5857544 6.0695496 -19.296997 11.965881 -24.821503 21.850403c-5.5245056 9.884506 -3.4448853 22.196838 -8.32547 37.45668c-4.8805847 15.259842 -17.29132 61.559067 -20.958008 54.10237c-3.6666565 -7.4566956 -1.9089966 -78.20691 -1.0419922 -98.84253c0.8670349 -20.635605 6.417328 -16.474182 6.24411 -24.97113c-0.17324829 -8.496933 -7.4566956 -19.767708 -7.283478 -26.01049c0.17321777 -6.2427826 4.6810913 -15.087486 8.322845 -11.4461975z' },
  { id: 'mb_delt_right', group: 'rear_delts', d: 'm520.2297 168.55328c0.5201416 4.6819763 19.09668 8.496933 26.900269 12.485565c7.803589 3.988617 14.173218 7.9776764 19.921265 11.446182c5.748047 3.4685059 12.312805 12.832901 14.566956 9.364838c2.2541504 -3.4680634 1.732727 -22.542877 -1.0419922 -30.173233c-2.7747192 -7.630356 -9.511841 -12.48732 -15.606323 -15.608917c-6.0944824 -3.1216125 -13.503906 -5.2016754 -20.960632 -3.1207428c-7.456665 2.0809326 -24.299622 10.924332 -23.779541 15.606308z' },
  { id: 'mb_teres_right', group: 'triceps', d: 'm574.1836 235.14505c1.2392578 9.363968 -2.1036987 15.259857 -0.8897705 22.88977c1.2139282 7.6299133 4.9037476 21.84909 8.173218 22.88977c3.2694702 1.0406799 11.4436035 -5.8945923 11.4436035 -16.64566c0 -10.751114 -6.9348145 -37.45627 -11.4436035 -47.8609c-4.508728 -10.404648 -14.39502 -17.68811 -15.608887 -14.56694c-1.2139282 3.12117 7.0861816 23.930008 8.325439 33.29396z' },
  { id: 'mb_ulat_right', group: 'upper_back', d: 'm545.0513 188.32306c1.8823242 5.8958893 -13.873108 19.94313 -19.769043 23.931747c-5.895874 3.9886322 -13.203369 3.4680786 -15.606262 0c-2.402893 -3.4680634 0.47024536 -14.912506 1.1889648 -20.808395c0.7187195 -5.8958893 -2.5743713 -14.046371 3.123352 -14.566925c5.697754 -0.5205536 29.180664 5.5476837 31.062988 11.443573z' },
  { id: 'mb_mid_right', group: 'lats', d: 'm546.0895 207.05254c2.6010132 2.9483795 -2.4541016 21.850388 -4.162781 34.335953c-1.7086182 12.485565 -2.8201904 27.398499 -6.0892334 40.577423c-3.268982 13.178925 -9.16449 37.802704 -13.524902 38.496063c-4.3604736 0.6933594 -7.9558105 -24.971985 -12.637817 -34.335968c-4.6819763 -9.363953 -15.2803955 -10.576111 -15.454071 -21.847748c-0.17364502 -11.271652 9.062134 -39.018814 14.412079 -45.782166c5.3499756 -6.763336 11.444885 7.109375 17.687683 5.2021027c6.242798 -1.9072571 17.167969 -19.59404 19.769043 -16.64566z' },
  { id: 'mb_llat_right', group: 'lower_back', d: 'm504.62427 296.5328c-3.6163635 -6.416443 -8.670593 -11.100159 -12.485565 -15.608917c-3.814972 -4.5087585 -8.843384 -22.541992 -10.404205 -11.443573c-1.560791 11.098419 -2.4033203 69.19031 1.0393677 78.03412c3.4427185 8.843842 14.439636 -20.289154 19.616821 -24.97113c5.1771545 -4.6819763 11.073914 1.2143555 11.446167 -3.1207275c0.37225342 -4.335083 -5.596222 -16.473297 -9.212585 -22.88977z' },
  { id: 'mb_ham_outer_right', group: 'hamstrings', d: 'm538.8089 391.21167c1.9072266 4.3355103 8.14917 19.250214 6.241455 40.580048c-1.9077148 21.329834 -13.3526 87.74582 -17.687683 87.39896c-4.335083 -0.34692383 -9.363525 -70.57831 -8.322815 -89.480316c1.0406494 -18.902008 11.272095 -17.51532 14.566895 -23.931763c3.2948608 -6.416443 3.2948608 -18.902435 5.2021484 -14.566925z' },
  { id: 'mb_ham_inner_right', group: 'hamstrings', d: 'm511.75903 419.3073c-2.7746887 -3.4685059 -9.736206 -0.17495728 -14.566925 -1.0419922c-4.8306885 -0.8670044 -12.683289 -10.923431 -14.417297 -4.160095c-1.7340393 6.763336 1.6102295 28.439636 4.0131226 44.740143c2.4028625 16.300537 7.9763794 40.924347 10.404175 53.06302c2.427826 12.138672 1.2147827 20.46283 4.1627502 19.769043c2.947937 -0.69384766 11.44397 -8.498291 13.524902 -23.931793c2.0809326 -15.433502 -0.5192261 -53.929565 -1.0393677 -68.66928c-0.52008057 -14.739716 0.6933594 -16.300537 -2.0813599 -19.769043z' },
  { id: 'mb_tricep_upper_right', group: 'triceps', d: 'm556.4981 195.60545c3.2948608 3.9886322 10.751526 32.60193 12.485596 41.619415c1.7340088 9.017502 -2.0813599 6.2427826 -2.0813599 12.485565c0 6.2427826 4.5091553 23.757217 2.0813599 24.971146c-2.4278564 1.2138977 -13.353455 -7.4562683 -16.648315 -17.687683c-3.2947998 -10.2314 -3.8145142 -33.469376 -3.1207275 -43.700775c0.6937866 -10.231415 3.9886475 -21.6763 7.2834473 -17.687668z' },
  { id: 'mb_tricep_lower_right', group: 'forearms', d: 'm569.1327 283.00433c-2.4278564 2.947937 -6.8565674 10.225708 -3.123352 24.9711c3.7331543 14.745422 22.57434 59.339478 25.522278 63.501312c2.947937 4.161865 -6.7025146 -27.599731 -7.834656 -38.53018c-1.1320801 -10.93042 1.5621338 -19.942688 1.0419922 -27.05249c-0.52008057 -7.1098022 -1.5616455 -11.791321 -4.1627197 -15.606293c-2.6010742 -3.814972 -9.015747 -10.231415 -11.4435425 -7.2834473z' },
  { id: 'mb_forearm_right', group: 'forearms', d: 'm591.58636 289.05115c2.229187 -3.814972 7.951416 4.855652 10.404175 19.769043c2.4527588 14.913361 6.541565 65.8963 4.312378 69.71127c-2.229248 3.814972 -15.234924 -31.908142 -17.687683 -46.821533c-2.4527588 -14.913361 0.7418823 -38.84381 2.9711304 -42.658783z' },
  { id: 'mb_glute_right', group: 'glutes', d: 'm479.50342 397.45795c2.947937 7.976837 11.6189575 13.004822 19.769012 13.524933c8.150055 0.5201416 23.062103 -3.1211548 29.131256 -10.404175c6.069092 -7.2830505 7.258484 -23.063019 7.2834473 -33.293976c0.024902344 -10.230957 -2.9969482 -21.328949 -7.13385 -28.091858c-4.136902 -6.762909 -9.859619 -16.473755 -17.687683 -12.485565c-7.828064 3.9881897 -24.053802 24.622925 -29.280823 36.414703c-5.227051 11.791779 -5.0293274 26.35913 -2.0813599 34.335938z' },
  { id: 'mb_calf_right', group: 'calves', d: 'm525.28143 528.5525c3.8149414 7.456299 12.312317 25.838196 14.566956 37.456726c2.2545776 11.61853 1.3884277 26.185059 -1.0394287 32.254578c-2.4277954 6.06958 -9.538879 4.856079 -13.527527 4.1627197c-3.9886475 -0.69329834 -7.28302 -9.363037 -10.404175 -8.322815c-3.1211853 1.0402222 -4.8547974 11.616394 -8.322876 14.564331c-3.468048 2.947937 -9.537598 9.539368 -12.485565 3.123352c-2.947937 -6.4160156 -6.24234 -29.82721 -5.2020874 -41.619446c1.0402527 -11.792236 6.7615967 -20.983826 11.443573 -29.13385c4.6819763 -8.150024 12.48645 -17.685486 16.648315 -19.766418c4.161804 -2.0809326 4.5078735 -0.17541504 8.322815 7.2808228z' },
  { id: 'mb_spine_left', group: 'upper_back', d: 'm463.83133 99.88413c-3.6417236 3.6412964 -5.550293 25.317154 -13.527557 33.29397c-7.9772644 7.9768066 -32.750214 8.4973755 -34.335968 14.566925c-1.5857239 6.0695496 19.297028 11.965881 24.821533 21.850403c5.5245056 9.884506 3.4448853 22.196838 8.32547 37.45668c4.880554 15.259842 17.29132 61.559067 20.958008 54.10237c3.6666565 -7.4566956 1.9089966 -78.20691 1.0419922 -98.84253c-0.8670349 -20.635605 -6.417328 -16.474182 -6.24411 -24.97113c0.17321777 -8.496933 7.4566956 -19.767708 7.283478 -26.01049c-0.17324829 -6.2427826 -4.681122 -15.087486 -8.322845 -11.4461975z' },
  { id: 'mb_delt_left', group: 'rear_delts', d: 'm429.34665 168.55328c-0.5201111 4.6819763 -19.09668 8.496933 -26.900269 12.485565c-7.803589 3.988617 -14.173218 7.9776764 -19.921234 11.446182c-5.748047 3.4685059 -12.312775 12.832901 -14.566956 9.364838c-2.2541504 -3.4680634 -1.7326965 -22.542877 1.0420227 -30.173233c2.7746887 -7.630356 9.51181 -12.48732 15.606293 -15.608917c6.0944824 -3.1216125 13.503937 -5.2016754 20.960632 -3.1207428c7.4566956 2.0809326 24.299652 10.924332 23.77951 15.606308z' },
  { id: 'mb_teres_left', group: 'triceps', d: 'm375.39276 235.14505c-1.2392883 9.363968 2.1036682 15.259857 0.8897705 22.88977c-1.2139282 7.6299133 -4.903778 21.84909 -8.173248 22.88977c-3.2694702 1.0406799 -11.443573 -5.8945923 -11.443573 -16.64566c0 -10.751114 6.934845 -37.45627 11.443573 -47.8609c4.5087585 -10.404648 14.39502 -17.68811 15.608948 -14.56694c1.2138977 3.12117 -7.0861816 23.930008 -8.32547 33.29396z' },
  { id: 'mb_ulat_left', group: 'upper_back', d: 'm404.52505 188.32306c-1.8823242 5.8958893 13.873138 19.94313 19.769043 23.931747c5.895874 3.9886322 13.2034 3.4680786 15.606293 0c2.402893 -3.4680634 -0.47024536 -14.912506 -1.1889648 -20.808395c-0.7187195 -5.8958893 2.5743408 -14.046371 -3.1233826 -14.566925c-5.6977234 -0.5205536 -29.180664 5.5476837 -31.062988 11.443573z' },
  { id: 'mb_mid_left', group: 'lats', d: 'm403.4869 207.05254c-2.6010437 2.9483795 2.454071 21.850388 4.1627197 34.335953c1.7086487 12.485565 2.820221 27.398499 6.0892334 40.577423c3.269043 13.178925 9.16449 37.802704 13.524933 38.496063c4.3604736 0.6933594 7.955841 -24.971985 12.637817 -34.335968c4.6819763 -9.363953 15.2803955 -10.576111 15.454041 -21.847748c0.17367554 -11.271652 -9.062103 -39.018814 -14.412048 -45.782166c-5.3499756 -6.763336 -11.444885 7.109375 -17.687683 5.2021027c-6.2427673 -1.9072571 -17.167969 -19.59404 -19.769012 -16.64566z' },
  { id: 'mb_llat_left', group: 'lower_back', d: 'm444.9521 296.5328c3.6163635 -6.416443 8.670593 -11.100159 12.485565 -15.608917c3.8149414 -4.5087585 8.843384 -22.541992 10.404175 -11.443573c1.5608215 11.098419 2.4033508 69.19031 -1.0393677 78.03412c-3.442688 8.843842 -14.439606 -20.289154 -19.61679 -24.97113c-5.1771545 -4.6819763 -11.073914 1.2143555 -11.4461975 -3.1207275c-0.37225342 -4.335083 5.5962524 -16.473297 9.212616 -22.88977z' },
  { id: 'mb_ham_outer_left', group: 'hamstrings', d: 'm410.76746 391.21167c-1.9072571 4.3355103 -8.14917 19.250214 -6.241455 40.580048c1.9076843 21.329834 13.35257 87.74582 17.687653 87.39896c4.335083 -0.34692383 9.363525 -70.57831 8.322845 -89.480316c-1.0406799 -18.902008 -11.272095 -17.51532 -14.566925 -23.931763c-3.2948303 -6.416443 -3.2948303 -18.902435 -5.202118 -14.566925z' },
  { id: 'mb_ham_inner_left', group: 'hamstrings', d: 'm437.8173 419.3073c2.7747192 -3.4685059 9.736237 -0.17495728 14.566925 -1.0419922c4.830719 -0.8670044 12.683289 -10.923431 14.417328 -4.160095c1.7340393 6.763336 -1.6102295 28.439636 -4.0131226 44.740143c-2.402893 16.300537 -7.9763794 40.924347 -10.404205 53.06302c-2.4277954 12.138672 -1.2147827 20.46283 -4.1627197 19.769043c-2.947937 -0.69384766 -11.444 -8.498291 -13.524933 -23.931793c-2.0809326 -15.433502 0.5192566 -53.929565 1.0393677 -68.66928c0.5201111 -14.739716 -0.6933594 -16.300537 2.0813599 -19.769043z' },
  { id: 'mb_tricep_upper_left', group: 'triceps', d: 'm393.07822 195.60545c-3.2948303 3.9886322 -10.751526 32.60193 -12.485565 41.619415c-1.7340393 9.017502 2.0813599 6.2427826 2.0813599 12.485565c0 6.2427826 -4.509186 23.757217 -2.0813599 24.971146c2.427826 1.2138977 13.353455 -7.4562683 16.648285 -17.687683c3.2948608 -10.2314 3.8145447 -33.469376 3.120758 -43.700775c-0.6937866 -10.231415 -3.9886475 -21.6763 -7.283478 -17.687668z' },
  { id: 'mb_tricep_lower_left', group: 'forearms', d: 'm380.4437 283.00433c2.4277954 2.947937 6.8565063 10.225708 3.123352 24.9711c-3.7331543 14.745422 -22.574371 59.339478 -25.522308 63.501312c-2.9479675 4.161865 6.7025146 -27.599731 7.8346252 -38.53018c1.1321106 -10.93042 -1.5621033 -19.942688 -1.0419922 -27.05249c0.5201416 -7.1098022 1.561676 -11.791321 4.1627502 -15.606293c2.6010437 -3.814972 9.015747 -10.231415 11.443573 -7.2834473z' },
  { id: 'mb_forearm_left', group: 'forearms', d: 'm357.99 289.05115c-2.2292175 -3.814972 -7.9514465 4.855652 -10.404205 19.769043c-2.4527588 14.913361 -6.541565 65.8963 -4.312317 69.71127c2.2292175 3.814972 15.234894 -31.908142 17.687653 -46.821533c2.4527588 -14.913361 -0.74191284 -38.84381 -2.9711304 -42.658783z' },
  { id: 'mb_glute_left', group: 'glutes', d: 'm470.07294 397.45795c-2.947937 7.976837 -11.618988 13.004822 -19.769012 13.524933c-8.150055 0.5201416 -23.062134 -3.1211548 -29.131256 -10.404175c-6.069092 -7.2830505 -7.2585144 -23.063019 -7.2834473 -33.293976c-0.024932861 -10.230957 2.9969482 -21.328949 7.13385 -28.091858c4.1369324 -6.762909 9.859589 -16.473755 17.687683 -12.485565c7.828064 3.9881897 24.053802 24.622925 29.280823 36.414703c5.227051 11.791779 5.029297 26.35913 2.0813599 34.335938z' },
  { id: 'mb_calf_left', group: 'calves', d: 'm424.29492 528.5525c-3.814972 7.456299 -12.312347 25.838196 -14.566925 37.456726c-2.2546082 11.61853 -1.3884583 26.185059 1.0393677 32.254578c2.427826 6.06958 9.53894 4.856079 13.527557 4.1627197c3.988617 -0.69329834 7.28302 -9.363037 10.404205 -8.322815c3.1211548 1.0402222 4.854767 11.616394 8.322815 14.564331c3.4680786 2.947937 9.537628 9.539368 12.485565 3.123352c2.9479675 -6.4160156 6.24234 -29.82721 5.202118 -41.619446c-1.0402527 -11.792236 -6.7615967 -20.983826 -11.443573 -29.13385c-4.6819763 -8.150024 -12.48645 -17.685486 -16.648285 -19.766418c-4.161865 -2.0809326 -4.5078735 -0.17541504 -8.322845 7.2808228z' },
];

const BackMuscleMap = ({ state, className = 'w-full h-auto' }: { state: Record<string, number>; className?: string }) => (
  <svg viewBox="330 80 300 560" className={className}>
    {BACK_MUSCLE_PATHS.map((m) => {
      const level = state[m.group] ?? 0;
      return (
        <path
          key={m.id}
          d={m.d}
          fill={getColor(level)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          style={{ transition: 'fill 0.8s ease', filter: level >= 2 ? `drop-shadow(0 0 6px ${getColor(level)})` : 'none' }}
        />
      );
    })}
  </svg>
);

// Count-up number that tweens whenever its target changes — this is what makes
// an athlete switch feel like the values "shift" instead of fade out and in.
const AnimatedNumber = ({
  value,
  format,
}: {
  value: number;
  format?: (n: number) => string;
}) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 620;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format ? format(display) : display.toLocaleString()}</>;
};

// Small circular progress ring used for Score / Food Score / Consistency.
const Ring = ({ value, color, size = 54, label }: { value: number; color: string; size?: number; label?: string }) => {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={c}
            initial={false}
            animate={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color, fontSize: size * 0.3 }}>
          <AnimatedNumber value={value} format={(n) => `${n}`} />
        </div>
      </div>
      {label && <span className="mt-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">{label}</span>}
    </div>
  );
};

const StatTile = ({ icon: Icon, value, label, format }: { icon: any; value: number; label: string; format?: (n: number) => string }) => (
  <div className="flex flex-col items-center gap-1 py-2.5">
    <Icon size={15} style={{ color: BLUE }} />
    <span className="text-white font-bold text-[16px] leading-none tabular-nums">
      <AnimatedNumber value={value} format={format} />
    </span>
    <span className="text-white/40 text-[10px]">{label}</span>
  </div>
);

const Card = ({ children, className = '', pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) => (
  <div
    className={`rounded-2xl ${pad ? 'p-3.5' : ''} ${className}`}
    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
  >
    {children}
  </div>
);

const MiniBars = ({ data, color = BLUE }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-11">
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-[3px]"
          style={{ background: i === data.length - 1 ? color : `${color}55` }}
          initial={false}
          animate={{ height: `${(d / max) * 100}%` }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
};

const DEEP_TABS = ['Nutrition', 'Workouts', 'Strength'] as const;
type DeepTab = (typeof DEEP_TABS)[number];

const CoachDashboardPreview = () => {
  const [activeId, setActiveId] = useState(ATHLETES[0].id);
  const athlete = useMemo(() => ATHLETES.find((a) => a.id === activeId)!, [activeId]);

  const [deepTab, setDeepTab] = useState<DeepTab>('Nutrition');
  const [editingMacros, setEditingMacros] = useState(false);
  const [draft, setDraft] = useState<Macros>(athlete.macros);
  const [savedFlash, setSavedFlash] = useState(false);

  // Reset the macro draft + close the editor whenever the coach switches athlete.
  useEffect(() => {
    setDraft(athlete.macros);
    setEditingMacros(false);
  }, [athlete]);

  const step = (key: keyof Macros, delta: number) =>
    setDraft((d) => ({ ...d, [key]: Math.max(0, d[key] + delta) }));

  const saveMacros = () => {
    setEditingMacros(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  // ---- custom draggable scrollbar -----------------------------------------
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ progress: 0, thumb: 0.28 });

  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScroll({
      progress: max > 0 ? el.scrollTop / max : 0,
      thumb: Math.max(0.14, Math.min(1, el.clientHeight / el.scrollHeight)),
    });
  };

  useEffect(() => {
    measure();
    // Content height changes when athlete / editor / tab changes.
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [athlete, editingMacros, deepTab]);

  const HANDLE = 14; // px — the draggable circle sitting on the external rail
  const RAIL = 360; // px — height of the external scrollbar rail
  const startThumbDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - 16 - HANDLE; // 8px pad top+bottom
      let p = (ev.clientY - rect.top - 8 - HANDLE / 2) / travel;
      p = Math.max(0, Math.min(1, p));
      el.scrollTop = p * (el.scrollHeight - el.clientHeight);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <section className="relative py-20 lg:py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)' }}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center max-w-[760px] mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
          >
            The coach view
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Tap any athlete. See everything.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-foreground/70 text-lg">
            This is the exact screen you get on every athlete — auto-verified training and
            nutrition, a live muscle map, and macros you assign in a tap. No self-reporting,
            no chasing. Switch between athletes below and scroll through it.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center max-w-[960px] mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: athlete switcher + coach-facing bullets */}
          <div className="order-2 lg:order-1 w-full max-w-[420px] mx-auto lg:justify-self-end">
            <p className="text-foreground/45 text-xs font-semibold tracking-widest uppercase mb-3">Your roster</p>
            <div className="space-y-2.5">
              {ATHLETES.map((a) => {
                const on = a.id === activeId;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveId(a.id)}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-300 border"
                    style={{
                      background: on ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderColor: on ? 'hsl(var(--primary) / 0.45)' : 'rgba(255,255,255,0.06)',
                      boxShadow: on ? '0 12px 34px -12px hsl(var(--primary) / 0.45)' : 'none',
                    }}
                  >
                    <span
                      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[15px]"
                      style={{ background: `linear-gradient(135deg, ${a.grad[0]}, ${a.grad[1]})` }}
                    >
                      {a.initials}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-foreground font-semibold text-[15px] truncate">{a.name}</span>
                      <span className="block text-foreground/45 text-[12.5px]">{a.position}</span>
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block font-bold text-[18px] tabular-nums leading-none" style={{ color: on ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.6)' }}>{a.score}</span>
                      <span className="block text-foreground/35 text-[10px] tracking-wider uppercase mt-0.5">Score</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2.5 max-w-[340px]">
              {[
                'Every stat auto-verified from their logs — never self-reported',
                'Live muscle-focus map from their real training volume',
                'Assign calorie & macro targets in one tap',
                'Deep-dive nutrition, workouts and strength trends',
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 text-foreground/65 text-sm">
                  <Check size={15} className="text-primary shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the phone — house frame, app surface, custom scrollbar */}
          <div className="order-1 lg:order-2 justify-self-center lg:justify-self-start flex items-start gap-5">
            <div
              className="relative w-[330px] shrink-0 rounded-[44px] p-[3px]"
              style={{
                background: '#1c1c1e',
                boxShadow: '0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {/* screen */}
              <div className="relative rounded-[41px] overflow-hidden" style={{ background: APP_BG, height: 660 }}>
                {/* dynamic island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[96px] h-[26px] rounded-full bg-black" />

                {/* scrollable content */}
                <div
                  ref={scrollRef}
                  onScroll={measure}
                  className="absolute inset-0 pt-10 pb-8 px-3.5 overflow-y-auto hide-scrollbar"
                >
                  <div className="space-y-3">
                    {/* profile */}
                    <Card className="flex items-center gap-3">
                      <span
                        className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-[15px]"
                        style={{ background: `linear-gradient(135deg, ${athlete.grad[0]}, ${athlete.grad[1]})` }}
                      >
                        {athlete.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-[16px] leading-tight truncate">{athlete.name}</div>
                        <div className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mt-0.5">{athlete.position} · This season</div>
                      </div>
                      <Ring value={athlete.score} color={BLUE} label="Score" />
                    </Card>

                    {/* stats grid */}
                    <Card pad={false} className="overflow-hidden">
                      <div className="grid grid-cols-3 divide-x divide-y divide-white/[0.06]">
                        <StatTile icon={Dumbbell} value={athlete.workouts} label="Workouts" />
                        <StatTile icon={Weight} value={athlete.volume} label="Volume" format={(n) => `${fmtVol(n)} lb`} />
                        <StatTile icon={Utensils} value={athlete.daysLogged} label="Days Logged" />
                        <StatTile icon={Zap} value={athlete.avgProtein} label="Avg Protein" format={(n) => `${n}g`} />
                        <StatTile icon={BarChart3} value={athlete.volPerWorkout} label="Vol / Workout" format={(n) => `${fmtVol(n)} lb`} />
                        <StatTile icon={Droplets} value={athlete.loggingRate} label="Logging Rate" format={(n) => `${n}%`} />
                      </div>
                    </Card>
                    <p className="text-white/35 text-[11px] text-center leading-snug px-3">
                      All stats are auto-verified from {athlete.first}'s logged workouts and nutrition — no self-reporting.
                    </p>

                    {/* muscle focus */}
                    <Card>
                      <div className="flex items-center gap-2 mb-2">
                        <PersonStanding size={15} style={{ color: BLUE }} />
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Muscle Focus</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex flex-col items-center">
                          <RealMuscleMap state={athlete.front} className="w-[108px] h-auto" />
                          <span className="text-white/30 text-[9px] tracking-widest uppercase">Front</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <BackMuscleMap state={athlete.back} className="w-[85px] h-auto" />
                          <span className="text-white/30 text-[9px] tracking-widest uppercase">Back</span>
                        </div>
                      </div>
                      <p className="text-white/35 text-[10.5px] leading-snug mt-1">
                        Emphasis spread from {athlete.first}'s verified training volume — green is dialed, red is heavy.
                      </p>
                    </Card>

                    {/* coach insights */}
                    <Card>
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope size={15} style={{ color: BLUE }} />
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Coach Insights</span>
                      </div>
                      <div className="flex items-start justify-around">
                        <Ring value={athlete.foodScore} color="#ff453a" size={52} label="Food Score" />
                        <Ring value={athlete.consistency} color="#ff453a" size={52} label="Consistency" />
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col items-center justify-center gap-0.5" style={{ width: 52, height: 52 }}>
                            <Heart size={15} className="fill-[#ff453a] text-[#ff453a]" />
                            <span className="text-[#ff453a] font-bold leading-none tabular-nums" style={{ fontSize: 15.6 }}>
                              <AnimatedNumber value={athlete.avgHR} format={(n) => `${n}`} />
                            </span>
                          </div>
                          <span className="mt-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">Avg HR</span>
                        </div>
                      </div>
                    </Card>

                    {/* assigned macros — interactive */}
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PieChart size={15} style={{ color: BLUE }} />
                          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Assigned Macros</span>
                        </div>
                        {savedFlash && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#30d158' }}>
                            <Check size={13} /> Saved
                          </span>
                        )}
                      </div>

                      {!editingMacros ? (
                        <>
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-white font-bold text-[24px] leading-none tabular-nums">
                                <AnimatedNumber value={draft.calories} />
                              </div>
                              <div className="text-white/40 text-[11px] mt-0.5">daily calories</div>
                            </div>
                            <div className="flex gap-4 text-center">
                              {([['P', draft.protein, '#0A84FF'], ['C', draft.carbs, '#30d158'], ['F', draft.fat, '#ff9f0a']] as const).map(([k, v, c]) => (
                                <div key={k}>
                                  <div className="font-bold text-[14px] tabular-nums" style={{ color: c }}>
                                    <AnimatedNumber value={v} format={(n) => `${n}g`} />
                                  </div>
                                  <div className="text-white/35 text-[10px]">{k}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingMacros(true)}
                            className="mt-3 w-full py-2.5 rounded-full font-semibold text-white text-[13px] flex items-center justify-center gap-1.5"
                            style={{ background: BLUE }}
                          >
                            <Plus size={14} /> Assign Macros
                          </button>
                        </>
                      ) : (
                        <div className="space-y-2.5">
                          {([['Calories', 'calories', 50], ['Protein', 'protein', 5], ['Carbs', 'carbs', 5], ['Fat', 'fat', 5]] as const).map(([label, key, d]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-white/70 text-[12px]">{label}</span>
                              <div className="flex items-center gap-3">
                                <button onClick={() => step(key, -d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                  <Minus size={13} />
                                </button>
                                <span className="text-white font-bold text-[13px] tabular-nums w-14 text-center">
                                  {draft[key].toLocaleString()}{key === 'calories' ? '' : 'g'}
                                </span>
                                <button onClick={() => step(key, d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={saveMacros}
                            className="mt-1 w-full py-2.5 rounded-full font-semibold text-white text-[13px]"
                            style={{ background: BLUE }}
                          >
                            Save targets
                          </button>
                        </div>
                      )}
                    </Card>

                    {/* deep dive — interactive tabs */}
                    <Card>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Search size={14} style={{ color: BLUE }} />
                          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Deep Dive</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: BLUE }}>Last 30 days <ChevronDown size={12} /></span>
                      </div>
                      <div className="flex gap-1 p-1 rounded-full bg-white/[0.06] mb-3">
                        {DEEP_TABS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setDeepTab(t)}
                            className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold transition ${deepTab === t ? 'bg-white/15 text-white' : 'text-white/45'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {deepTab === 'Nutrition' && (
                        <div>
                          <MiniBars data={athlete.nutrition} color="#30d158" />
                          <div className="flex justify-between mt-3 text-center">
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={Math.round(athlete.nutrition.reduce((a, b) => a + b, 0) / athlete.nutrition.length)} /></div><div className="text-white/35 text-[10px]">avg cal</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.loggingRate} format={(n) => `${n}%`} /></div><div className="text-white/35 text-[10px]">logged</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.avgProtein} format={(n) => `${n}g`} /></div><div className="text-white/35 text-[10px]">avg protein</div></div>
                          </div>
                        </div>
                      )}
                      {deepTab === 'Workouts' && (
                        <div>
                          <MiniBars data={athlete.workoutsBars} color={BLUE} />
                          <div className="flex justify-between mt-3 text-center">
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.workouts} format={(n) => `${n}`} /></div><div className="text-white/35 text-[10px]">sessions</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.volume} format={(n) => fmtVol(n)} /></div><div className="text-white/35 text-[10px]">total lb</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.daysLogged} format={(n) => `${n}`} /></div><div className="text-white/35 text-[10px]">days active</div></div>
                          </div>
                        </div>
                      )}
                      {deepTab === 'Strength' && (
                        <div className="space-y-2.5">
                          {athlete.lifts.map((l) => (
                            <div key={l.name} className="flex items-center gap-3">
                              <span className="flex-1 text-white/75 text-[12px]">{l.name}</span>
                              <div className="flex items-end gap-[3px] h-6">
                                {l.trend.map((v, i) => {
                                  const mx = Math.max(...l.trend);
                                  return (
                                    <motion.div
                                      key={i}
                                      className="w-[5px] rounded-t-[2px]"
                                      initial={false}
                                      animate={{ height: `${(v / mx) * 100}%` }}
                                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                      style={{ background: i === l.trend.length - 1 ? BLUE : `${BLUE}55` }}
                                    />
                                  );
                                })}
                              </div>
                              <span className="text-white font-bold text-[13px] tabular-nums w-14 text-right"><AnimatedNumber value={l.value} format={(n) => `${n} lb`} /></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* external draggable scrollbar with circle handle */}
            <div ref={trackRef} className="relative w-4 shrink-0 self-center" style={{ height: RAIL }}>
              {/* rail line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] rounded-full bg-white/10" />
              {/* progress fill */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-2 w-[2px] rounded-full"
                style={{
                  height: `${scroll.progress * (RAIL - 16 - HANDLE)}px`,
                  background: 'hsl(var(--primary) / 0.5)',
                }}
              />
              {/* circle handle */}
              <div
                onPointerDown={startThumbDrag}
                className="absolute left-1/2 -translate-x-1/2 rounded-full cursor-grab active:cursor-grabbing touch-none"
                style={{
                  width: HANDLE,
                  height: HANDLE,
                  top: `${8 + scroll.progress * (RAIL - 16 - HANDLE)}px`,
                  background: 'hsl(var(--primary))',
                  boxShadow: '0 0 0 4px hsl(var(--primary) / 0.18), 0 4px 12px -2px rgba(0,0,0,0.6)',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoachDashboardPreview;
