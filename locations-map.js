/* ==========================================================================
   Tender Care — location finder
   A self-contained vector map: no map library, no tile server, works from
   file://. Geography is drawn as SVG in Web Mercator; markers, labels and the
   selected-center card are HTML layers positioned from the same camera.
   ========================================================================== */
(function () {
  'use strict';

  var locations = [
    { id: 'bethel-park', name: 'Bethel Park', address: '5189 Library Road Bethel Park, PA 15102', phone: '(412) 887-6642', lat: 40.3338856, lng: -80.0228448, image: 'https://tendercarelc.org/wp-content/uploads/2023/09/bethel_park_front.jpg' },
    { id: 'cranberry', name: 'Cranberry', address: '102 Teddy Bear Lane Mars, PA 16046', phone: '(724) 702-3337', lat: 40.6721155, lng: -80.099145, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/Attachment-2-1024x768.jpg' },
    { id: 'green-tree', name: 'Green Tree', address: 'Foster Plaza III 601 Holiday Drive Pittsburgh, PA 15220', phone: '(412) 883-5547', lat: 40.4221191, lng: -80.0595094, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/greentree_front-1024x768.jpg' },
    { id: 'hampton', name: 'Hampton', address: '2852 Oxford Boulevard Allison Park, PA 15101', phone: '(412) 900-7991', lat: 40.5914608, lng: -79.9503333, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG-6117-1-1024x768.jpeg' },
    { id: 'hermitage', name: 'Hermitage', address: '1475 N. Hermitage Road Hermitage, PA 16148', phone: '(724) 702-3889', lat: 41.2539478, lng: -80.4515408, image: 'https://tendercarelc.org/wp-content/uploads/2023/03/IMG_3175-e1679677128689.jpg' },
    { id: 'jefferson', name: 'Jefferson', address: '550 Coal Valley Road Clairton, PA 15025', phone: '(412) 203-9990', lat: 40.3180147, lng: -79.9042175, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/jefferson_front-1024x768.jpg' },
    { id: 'lower-burrell', name: 'Lower Burrell', address: 'Town Hall Center 2400 Leechburg Road New Kensington, PA 15068', phone: '(724) 702-3373', lat: 40.586852, lng: -79.749212, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG_5549-1024x768.jpeg' },
    { id: 'mccandless', name: 'McCandless', address: '8413 Perry Highway Pittsburgh, PA 15237', phone: '(412) 361-9669', lat: 40.5546584, lng: -80.0386359, image: 'https://tendercarelc.org/wp-content/uploads/2026/02/IMG_5312-1024x768.jpeg' },
    { id: 'meadowlands', name: 'Meadowlands', address: '2000 Park Place Drive, Suite 201 Washington, PA 15301', phone: '(724) 221-9880', lat: 40.212574, lng: -80.1926092, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/meadowlands_exterior-1024x768.jpg' },
    { id: 'monroeville', name: 'Monroeville', address: '4420 Old Wm. Penn Highway Monroeville, PA 15146', phone: '(412) 379-6868', lat: 40.445719, lng: -79.764008, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG_5540-1024x768.jpeg' },
    { id: 'moon-township', name: 'Moon Township', address: '1005 Beaver Grade Road Coraopolis, PA 15108', phone: '(412) 903-3888', lat: 40.505482, lng: -80.2054789, image: 'https://tendercarelc.org/wp-content/uploads/2025/02/IMG_6682-1024x768.jpeg' },
    { id: 'mt-lebanon', name: 'Mt. Lebanon', address: '2220 Swallow Hill Road Pittsburgh, PA 15220', phone: '(412) 899-1313', lat: 40.391907, lng: -80.0760831, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/IMG_6714-1024x768.jpg' },
    { id: 'murrysville', name: 'Murrysville', address: '4490 Old William Penn Highway Murrysville, PA 15668', phone: '(724) 551-8009', lat: 40.4274861, lng: -79.6750506, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/murrysville_exterior-1-1024x768.jpg' },
    { id: 'new-castle', name: 'New Castle', address: '2002 Wilmington Road New Castle, PA 16105', phone: '(724) 670-3055', lat: 41.0126654, lng: -80.3506847, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/NEW-Front-of-Building-2-1024x768.jpg' },
    { id: 'pierpont', name: 'Pierpont', address: '600 Fort Pierpont Drive, Morgantown, WV 26508', phone: '(304) 249-9599', lat: 39.6485717, lng: -79.8915698, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/DSC_0098-1024x768.jpg' },
    { id: 'robinson', name: 'Robinson', address: '200 Cedar Ridge Drive, Suite 213 Pittsburgh, PA 15205', phone: '(412) 435-4331', lat: 40.4477462, lng: -80.107548, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG-4892-1024x768.jpg' },
    { id: 'ross-township', name: 'Ross Township', address: '4721 McKnight Road Suite 210 Pittsburgh, PA 15237', phone: '(412) 899-1314', lat: 40.4945482, lng: -80.0117899, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/IMG_6399.jpg' },
    { id: 'shadyside', name: 'Shadyside', address: '5425 Baum Blvd Pittsburgh, PA 15232', phone: '(412) 226-4452', lat: 40.4569398, lng: -79.9382406, image: 'https://tendercarelc.org/wp-content/uploads/2026/05/Shadyside-pic-for-website.png' },
    { id: 'wexford', name: 'Wexford', address: '10 North Meadows Drive Wexford, PA 15090', phone: '(724) 952-3337', lat: 40.6123802, lng: -80.0544012, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/Attachment-7-1024x768.jpg' },
    { id: 'whitehall', name: 'Whitehall', address: '300 Weyman Plaza, Suite 100 Pittsburgh, PA 15236', phone: '(412) 883-8898', lat: 40.3604077, lng: -79.9998433, image: 'https://tendercarelc.org/wp-content/uploads/2023/03/IMG_7205.jpg' }
  ];

  /* ------------------------------------------------------------------------
     Geography — simplified, hand-traced [lng, lat] lines for the region
     ------------------------------------------------------------------------ */
  var GEO = {
    lakeErie: [[-82.6, 41.42], [-81.7, 41.5], [-81.0, 41.86], [-80.52, 41.98], [-80.08, 42.15], [-79.76, 42.27], [-79.33, 42.49], [-78.9, 42.85], [-77.4, 43.3], [-77.4, 44], [-82.6, 44]],
    pennsylvania: [[-80.519, 39.7206], [-80.519, 42.3], [-79.762, 42.3], [-79.762, 42.0], [-77.4, 42.0], [-77.4, 39.7206]],
    urban: [
      [[-80.17, 40.36], [-80.11, 40.29], [-79.99, 40.30], [-79.87, 40.32], [-79.79, 40.37], [-79.74, 40.44], [-79.79, 40.51], [-79.88, 40.55], [-79.98, 40.60], [-80.08, 40.59], [-80.17, 40.53], [-80.22, 40.45]]
    ],
    towns: [
      [-79.956, 39.63, .05, .035], [-80.246, 40.174, .04, .03], [-80.347, 41.0, .04, .03], [-80.47, 41.235, .05, .03],
      [-79.896, 40.861, .035, .025], [-79.539, 40.301, .035, .025], [-80.70, 40.07, .04, .04], [-80.62, 40.39, .035, .04],
      [-80.65, 41.10, .09, .05], [-80.30, 40.69, .045, .03], [-79.716, 39.9, .03, .02], [-80.142, 39.485, .035, .025],
      [-79.153, 40.621, .03, .02], [-79.38, 40.32, .025, .02], [-79.589, 40.018, .025, .02], [-80.577, 40.619, .025, .015]
    ],
    parks: [
      [-80.00, 40.605, .03, .02], [-80.43, 40.51, .05, .03], [-80.10, 40.945, .09, .035], [-80.17, 40.95, .03, .02],
      [-80.17, 40.43, .02, .015], [-79.99, 40.30, .025, .018], [-79.75, 40.48, .02, .015], [-79.905, 40.434, .012, .008],
      [-79.49, 39.87, .07, .05], [-79.79, 39.655, .05, .03], [-79.22, 40.10, .14, .1], [-79.15, 39.75, .12, .07],
      [-80.28, 39.80, .05, .04], [-80.45, 41.30, .04, .03], [-79.95, 41.08, .03, .02], [-79.43, 40.72, .05, .03]
    ],
    lakes: [
      [[-80.17, 40.955], [-80.13, 40.948], [-80.09, 40.935], [-80.05, 40.928], [-80.04, 40.934], [-80.08, 40.946], [-80.12, 40.958], [-80.16, 40.963]],
      [[-80.455, 41.27], [-80.43, 41.29], [-80.41, 41.31], [-80.40, 41.325], [-80.415, 41.33], [-80.435, 41.31], [-80.45, 41.29]],
      [[-79.88, 39.665], [-79.86, 39.672], [-79.835, 39.69], [-79.82, 39.71], [-79.83, 39.712], [-79.85, 39.695], [-79.875, 39.675]],
      [[-79.40, 39.72], [-79.38, 39.74], [-79.36, 39.77], [-79.37, 39.775], [-79.39, 39.75], [-79.41, 39.725]]
    ],
    rivers: {
      major: [
        [[-80.0125, 40.4417], [-80.033, 40.457], [-80.06, 40.478], [-80.09, 40.497], [-80.12, 40.512], [-80.15, 40.522], [-80.18, 40.538], [-80.205, 40.565], [-80.228, 40.595], [-80.25, 40.625], [-80.275, 40.657], [-80.30, 40.682], [-80.325, 40.69], [-80.36, 40.68], [-80.40, 40.655], [-80.44, 40.64], [-80.48, 40.636], [-80.519, 40.637], [-80.56, 40.618], [-80.60, 40.615], [-80.625, 40.60], [-80.64, 40.57], [-80.66, 40.52], [-80.63, 40.46], [-80.60, 40.41], [-80.61, 40.36], [-80.615, 40.30], [-80.61, 40.25], [-80.64, 40.18], [-80.68, 40.12], [-80.73, 40.065], [-80.74, 40.0], [-80.75, 39.93], [-80.80, 39.85], [-80.83, 39.75], [-80.87, 39.66], [-80.95, 39.58], [-81.05, 39.53], [-81.15, 39.45], [-81.25, 39.40], [-81.45, 39.41], [-81.6, 39.30], [-81.8, 39.1]],
        [[-80.0125, 40.4417], [-79.99, 40.455], [-79.965, 40.47], [-79.93, 40.483], [-79.90, 40.49], [-79.87, 40.505], [-79.84, 40.52], [-79.81, 40.535], [-79.785, 40.552], [-79.765, 40.57], [-79.755, 40.60], [-79.73, 40.625], [-79.70, 40.655], [-79.675, 40.675], [-79.62, 40.71], [-79.57, 40.745], [-79.535, 40.775], [-79.525, 40.81], [-79.53, 40.85], [-79.57, 40.92], [-79.61, 40.98], [-79.64, 41.06], [-79.70, 41.15], [-79.72, 41.22], [-79.78, 41.30], [-79.83, 41.39], [-79.71, 41.43], [-79.55, 41.55]],
        [[-80.0125, 40.4417], [-79.99, 40.432], [-79.96, 40.425], [-79.93, 40.41], [-79.905, 40.405], [-79.88, 40.39], [-79.865, 40.36], [-79.86, 40.34], [-79.88, 40.30], [-79.89, 40.265], [-79.905, 40.225], [-79.925, 40.19], [-79.905, 40.15], [-79.875, 40.12], [-79.89, 40.07], [-79.885, 40.02], [-79.91, 39.96], [-79.93, 39.89], [-79.92, 39.80], [-79.91, 39.74], [-79.93, 39.68], [-79.955, 39.635], [-79.98, 39.58], [-80.05, 39.52], [-80.14, 39.48]]
      ],
      minor: [
        [[-79.86, 40.35], [-79.82, 40.30], [-79.78, 40.25], [-79.72, 40.19], [-79.66, 40.12], [-79.60, 40.04], [-79.59, 40.01], [-79.53, 39.93], [-79.49, 39.87], [-79.42, 39.80], [-79.38, 39.73]],
        [[-80.305, 40.695], [-80.32, 40.75], [-80.33, 40.80], [-80.34, 40.86], [-80.335, 40.93], [-80.345, 40.98], [-80.35, 41.0], [-80.38, 41.05], [-80.42, 41.12], [-80.46, 41.18], [-80.49, 41.23], [-80.47, 41.27], [-80.44, 41.30]],
        [[-80.36, 40.99], [-80.45, 41.0], [-80.52, 41.02], [-80.6, 41.07], [-80.66, 41.10], [-80.75, 41.17], [-80.85, 41.22]],
        [[-79.675, 40.675], [-79.62, 40.645], [-79.55, 40.61], [-79.48, 40.55], [-79.45, 40.49], [-79.33, 40.45], [-79.2, 40.42]],
        [[-79.86, 39.67], [-79.80, 39.60], [-79.75, 39.55], [-79.70, 39.45]]
      ]
    },
    roads: {
      interstate: [
        [[-79.98, 39.60], [-80.08, 39.72], [-80.17, 39.90], [-80.20, 40.05], [-80.24, 40.17], [-80.18, 40.26], [-80.11, 40.35], [-80.10, 40.41], [-80.11, 40.47], [-80.12, 40.51], [-80.10, 40.55], [-80.07, 40.60], [-80.10, 40.68], [-80.10, 40.80], [-80.09, 40.95], [-80.07, 41.06], [-80.08, 41.16], [-80.07, 41.20], [-80.15, 41.45], [-80.12, 41.9]],
        [[-80.52, 40.88], [-80.37, 40.86], [-80.22, 40.76], [-80.10, 40.69], [-80.0, 40.63], [-79.95, 40.60], [-79.84, 40.56], [-79.81, 40.535], [-79.76, 40.43], [-79.70, 40.32], [-79.60, 40.22], [-79.36, 40.11], [-79.07, 40.0], [-78.5, 39.98]],
        [[-80.74, 40.07], [-80.55, 40.10], [-80.27, 40.16], [-80.15, 40.15], [-80.0, 40.12], [-79.87, 40.15], [-79.74, 40.18], [-79.60, 40.22]],
        [[-80.85, 41.18], [-80.52, 41.18], [-80.43, 41.20], [-80.24, 41.22], [-80.07, 41.20], [-79.97, 41.20], [-79.6, 41.17], [-79.4, 41.17], [-78.9, 41.15]],
        [[-79.95, 39.62], [-79.80, 39.65], [-79.60, 39.68], [-79.30, 39.70], [-78.9, 39.68]],
        [[-79.76, 40.425], [-79.77, 40.43], [-79.82, 40.44], [-79.85, 40.44], [-79.87, 40.43], [-79.92, 40.428], [-79.96, 40.437], [-79.995, 40.4406], [-80.02, 40.432], [-80.05, 40.42], [-80.09, 40.415], [-80.15, 40.445], [-80.19, 40.465], [-80.23, 40.49], [-80.27, 40.53], [-80.28, 40.60], [-80.30, 40.68], [-80.36, 40.75], [-80.36, 40.85], [-80.33, 41.0], [-80.39, 41.08], [-80.40, 41.19]],
        [[-80.005, 40.448], [-80.02, 40.48], [-80.04, 40.51], [-80.05, 40.55], [-80.07, 40.575]],
        [[-79.95, 39.62], [-80.05, 39.52], [-80.15, 39.48], [-80.25, 39.30]],
        [[-80.85, 41.10], [-80.65, 41.10], [-80.55, 41.12], [-80.52, 41.18]]
      ],
      major: [
        [[-79.99, 40.455], [-79.94, 40.50], [-79.82, 40.53], [-79.75, 40.61], [-79.68, 40.67], [-79.52, 40.81], [-79.38, 41.0]],
        [[-80.01, 40.49], [-80.03, 40.55], [-80.06, 40.61], [-80.10, 40.69], [-80.08, 40.82], [-80.06, 41.0]],
        [[-80.0, 40.44], [-80.05, 40.43], [-80.2, 40.43], [-80.4, 40.42], [-80.58, 40.41], [-80.75, 40.40]],
        [[-79.78, 40.43], [-79.67, 40.43], [-79.57, 40.41], [-79.40, 40.43], [-79.26, 40.43]],
        [[-80.04, 40.40], [-80.06, 40.36], [-80.09, 40.30], [-80.13, 40.24], [-80.24, 40.17]],
        [[-80.0, 40.40], [-80.02, 40.33], [-80.03, 40.27], [-79.99, 40.18]],
        [[-80.34, 41.0], [-80.15, 40.93], [-79.90, 40.86], [-79.70, 40.84], [-79.52, 40.82]],
        [[-79.95, 40.48], [-79.94, 40.63], [-79.90, 40.86], [-79.86, 41.10]],
        [[-79.90, 40.33], [-79.90, 40.15], [-79.73, 39.92], [-79.85, 39.68]],
        [[-79.54, 40.30], [-79.65, 40.10], [-79.72, 39.90], [-79.92, 39.66]],
        [[-80.49, 41.23], [-80.24, 41.23], [-80.0, 41.25]],
        [[-80.52, 40.62], [-80.40, 40.65], [-80.31, 40.70], [-80.24, 40.70], [-80.18, 40.65]],
        [[-79.539, 40.301], [-79.38, 40.32], [-79.15, 40.33]],
        [[-80.24, 40.17], [-80.0, 40.05], [-79.72, 39.90], [-79.40, 39.80]]
      ]
    }
  };

  var LABELS = [
    { t: 'Pennsylvania', lng: -79.45, lat: 40.95, cls: 'state', max: 900 },
    { t: 'Ohio', lng: -80.95, lat: 40.62, cls: 'state', max: 900 },
    { t: 'West Virginia', lng: -80.35, lat: 39.42, cls: 'state', max: 900 },
    { t: 'Maryland', lng: -79.1, lat: 39.5, cls: 'state', max: 900 },
    { t: 'Pittsburgh', lng: -80.0, lat: 40.44, cls: 'city city--major', min: 0 },
    { t: 'Morgantown', lng: -79.956, lat: 39.63, cls: 'city', min: 0 },
    { t: 'Washington', lng: -80.246, lat: 40.174, cls: 'city', min: 0 },
    { t: 'Butler', lng: -79.896, lat: 40.861, cls: 'city', min: 0 },
    { t: 'Greensburg', lng: -79.539, lat: 40.301, cls: 'city', min: 0 },
    { t: 'Youngstown', lng: -80.649, lat: 41.10, cls: 'city', min: 0 },
    { t: 'Wheeling', lng: -80.721, lat: 40.064, cls: 'city', min: 0 },
    { t: 'Sharon', lng: -80.493, lat: 41.233, cls: 'city', min: 420 },
    { t: 'Steubenville', lng: -80.634, lat: 40.37, cls: 'city', min: 420 },
    { t: 'Beaver', lng: -80.305, lat: 40.695, cls: 'city', min: 420 },
    { t: 'Kittanning', lng: -79.522, lat: 40.817, cls: 'city', min: 420 },
    { t: 'Uniontown', lng: -79.716, lat: 39.9, cls: 'city', min: 420 },
    { t: 'Waynesburg', lng: -80.179, lat: 39.896, cls: 'city', min: 520 },
    { t: 'Fairmont', lng: -80.142, lat: 39.485, cls: 'city', min: 420 },
    { t: 'Indiana', lng: -79.153, lat: 40.621, cls: 'city', min: 420 },
    { t: 'Grove City', lng: -80.088, lat: 41.158, cls: 'city', min: 520 },
    { t: 'Mercer', lng: -80.24, lat: 41.227, cls: 'city', min: 620 },
    { t: 'Connellsville', lng: -79.589, lat: 40.018, cls: 'city', min: 620 },
    { t: 'McKeesport', lng: -79.864, lat: 40.348, cls: 'city', min: 900 },
    { t: 'Latrobe', lng: -79.38, lat: 40.32, cls: 'city', min: 620 },
    { t: 'East Liverpool', lng: -80.577, lat: 40.619, cls: 'city', min: 620 },
    { t: 'Salem', lng: -80.857, lat: 40.90, cls: 'city', min: 620 },
    { t: 'Sewickley', lng: -80.18, lat: 40.537, cls: 'town', min: 1500 },
    { t: 'Carnegie', lng: -80.083, lat: 40.408, cls: 'town', min: 2200 },
    { t: 'Bridgeville', lng: -80.11, lat: 40.356, cls: 'town', min: 1700 },
    { t: 'Canonsburg', lng: -80.187, lat: 40.262, cls: 'town', min: 1300 },
    { t: 'Oakmont', lng: -79.842, lat: 40.522, cls: 'town', min: 1700 },
    { t: 'Penn Hills', lng: -79.839, lat: 40.495, cls: 'town', min: 2200 },
    { t: 'Bellevue', lng: -80.05, lat: 40.494, cls: 'town', min: 2400 },
    { t: 'Coraopolis', lng: -80.166, lat: 40.518, cls: 'town', min: 2400 },
    { t: 'Gibsonia', lng: -79.97, lat: 40.63, cls: 'town', min: 1700 },
    { t: 'Zelienople', lng: -80.137, lat: 40.794, cls: 'town', min: 1300 },
    { t: 'New Kensington', lng: -79.765, lat: 40.57, cls: 'town', min: 1500 },
    { t: 'Irwin', lng: -79.701, lat: 40.325, cls: 'town', min: 1300 },
    { t: 'Clairton', lng: -79.882, lat: 40.292, cls: 'town', min: 1700 },
    { t: 'Upper St. Clair', lng: -80.083, lat: 40.336, cls: 'town', min: 2400 },
    { t: 'Aliquippa', lng: -80.24, lat: 40.637, cls: 'town', min: 1300 },
    { t: 'Ambridge', lng: -80.225, lat: 40.589, cls: 'town', min: 1700 },
    { t: 'Homestead', lng: -79.912, lat: 40.406, cls: 'town', min: 2600 },
    { t: 'Wilkinsburg', lng: -79.882, lat: 40.442, cls: 'town', min: 2600 },
    { t: 'Oakland', lng: -79.955, lat: 40.442, cls: 'town', min: 3600 },
    { t: 'Squirrel Hill', lng: -79.922, lat: 40.43, cls: 'town', min: 3600 },
    { t: 'Dormont', lng: -80.033, lat: 40.396, cls: 'town', min: 3600 },
    { t: 'Crafton', lng: -80.067, lat: 40.435, cls: 'town', min: 3600 },
    { t: 'Ohio River', lng: -80.21, lat: 40.58, cls: 'water', min: 900, rot: 52 },
    { t: 'Allegheny River', lng: -79.73, lat: 40.637, cls: 'water', min: 900, rot: -48 },
    { t: 'Monongahela River', lng: -79.875, lat: 40.235, cls: 'water', min: 900, rot: 78 },
    { t: 'Lake Arthur', lng: -80.10, lat: 40.925, cls: 'water', min: 1300 },
    { t: '79', lng: -80.10, lat: 40.86, cls: 'shield', min: 300 },
    { t: '79', lng: -80.215, lat: 40.10, cls: 'shield', min: 300 },
    { t: '76', lng: -79.66, lat: 40.27, cls: 'shield', min: 300 },
    { t: '76', lng: -80.30, lat: 40.81, cls: 'shield', min: 420 },
    { t: '70', lng: -80.45, lat: 40.115, cls: 'shield', min: 300 },
    { t: '80', lng: -80.16, lat: 41.21, cls: 'shield', min: 300 },
    { t: '376', lng: -80.35, lat: 40.92, cls: 'shield', min: 420 },
    { t: '376', lng: -79.86, lat: 40.436, cls: 'shield', min: 1300 },
    { t: '279', lng: -80.035, lat: 40.525, cls: 'shield', min: 1300 },
    { t: '68', lng: -79.70, lat: 39.667, cls: 'shield', min: 420 }
  ];

  /* ------------------------------------------------------------------------
     Elements
     ------------------------------------------------------------------------ */
  var finder = document.querySelector('[data-location-finder]');
  if (!finder) return;

  var compact = document.body.classList.contains('is-compact') || /[?&]compact=1\b/.test(window.location.search) || window.self !== window.top;
  if (compact) document.body.classList.add('is-compact');
  var linkTarget = compact ? '_top' : null;

  var results = finder.querySelector('[data-location-results]');
  var search = finder.querySelector('[data-location-search]');
  var clear = finder.querySelector('[data-location-clear]');
  var near = finder.querySelector('[data-location-near]');
  var status = finder.querySelector('[data-location-status]');
  var panel = finder.querySelector('[data-location-panel]');
  var viewButtons = Array.prototype.slice.call(finder.querySelectorAll('[data-location-view]'));
  var mapEl = finder.querySelector('[data-map]');
  var svg = finder.querySelector('[data-map-svg]');
  var labelLayer = finder.querySelector('[data-map-labels]');
  var markerLayer = finder.querySelector('[data-map-markers]');
  var pop = finder.querySelector('[data-location-preview]');
  var popImage = pop.querySelector('[data-location-image]');
  var popName = pop.querySelector('[data-location-name]');
  var popAddress = pop.querySelector('[data-location-address]');
  var popPhone = pop.querySelector('[data-location-phone]');
  var popPage = pop.querySelector('[data-location-page]');
  var popDirections = pop.querySelector('[data-location-directions]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var byId = {};
  locations.forEach(function (location) { byId[location.id] = location; });

  var activeId = null;
  var visibleIds = locations.map(function (location) { return location.id; });
  var origin = null;

  /* ------------------------------------------------------------------------
     Projection and camera
     ------------------------------------------------------------------------ */
  var DEG = 180 / Math.PI;
  function py(lat) { return -Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * DEG; }
  function project(lng, lat) { return [lng, py(lat)]; }

  locations.forEach(function (location) { location.p = project(location.lng, location.lat); });

  var MIN_K = 140;
  var MAX_K = 6400;
  var SELECT_K = 1900;
  var LIMIT = { x0: -81.7, x1: -78.4, y0: py(42.1), y1: py(39.1) };
  var cam = { x: -80.05, y: py(40.6), k: 300 };
  var size = { w: 0, h: 0 };
  var frame = null;
  var anim = null;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* the floating panel covers the left of the map on wide screens */
  function inset() {
    if (!panel || window.getComputedStyle(panel).position !== 'absolute') return { l: 0, r: 0, t: 0, b: 0 };
    return { l: panel.offsetLeft + panel.offsetWidth, r: 0, t: 0, b: 0 };
  }

  function toScreen(p, c) {
    c = c || cam;
    return [(p[0] - c.x) * c.k + size.w / 2, (p[1] - c.y) * c.k + size.h / 2];
  }

  function toWorld(sx, sy) {
    return [(sx - size.w / 2) / cam.k + cam.x, (sy - size.h / 2) / cam.k + cam.y];
  }

  function constrain(c) {
    c.k = clamp(c.k, MIN_K, MAX_K);
    c.x = clamp(c.x, LIMIT.x0, LIMIT.x1);
    c.y = clamp(c.y, LIMIT.y0, LIMIT.y1);
    return c;
  }

  /* camera that places world point p at the centre of the uncovered area */
  function cameraFor(p, k) {
    var pad = inset();
    return constrain({ x: p[0] - (pad.l - pad.r) / 2 / k, y: p[1] - (pad.t - pad.b) / 2 / k, k: k });
  }

  function cameraForBounds(points, maxK) {
    var pad = inset();
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    points.forEach(function (p) {
      x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
      y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
    });
    var margin = size.w < 600 ? 44 : 64;
    var availW = Math.max(120, size.w - pad.l - pad.r - margin * 2);
    /* pins rise ~56px above their point, so reserve that headroom */
    var availH = Math.max(120, size.h - pad.t - pad.b - margin * 2 - 56);
    var k = Math.min(availW / Math.max(x1 - x0, 1e-4), availH / Math.max(y1 - y0, 1e-4), maxK || SELECT_K);
    return cameraFor([(x0 + x1) / 2, (y0 + y1) / 2 - 28 / k], k);
  }

  function animateTo(target, duration) {
    target = constrain(target);
    if (reduce || !duration) {
      anim = null;
      cam = target;
      draw();
      return;
    }
    var from = { x: cam.x, y: cam.y, k: cam.k };
    var start = performance.now();
    anim = function (now) {
      var t = clamp((now - start) / duration, 0, 1);
      var e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      var k = Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e);
      cam = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, k: k };
      if (t >= 1) { cam = target; anim = null; }
    };
    request();
  }

  function request() {
    if (frame) return;
    frame = requestAnimationFrame(function (now) {
      frame = null;
      if (anim) anim(now);
      draw();
      if (anim) request();
    });
  }

  /* ------------------------------------------------------------------------
     Static geography (built once, transformed by the camera)
     ------------------------------------------------------------------------ */
  var world = document.createElementNS(SVGNS, 'g');

  function pathFrom(coords, closed) {
    return coords.map(function (c, i) {
      var p = project(c[0], c[1]);
      return (i ? 'L' : 'M') + p[0].toFixed(4) + ' ' + p[1].toFixed(4);
    }).join('') + (closed ? 'Z' : '');
  }

  function ellipse(e) {
    var pts = [];
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * Math.PI * 2;
      /* a little irregularity so parks and towns do not read as perfect ovals */
      var wobble = 1 + Math.sin(a * 3 + e[0] * 40) * .12;
      pts.push([e[0] + Math.cos(a) * e[2] * wobble, e[1] + Math.sin(a) * e[3] * wobble]);
    }
    return pathFrom(pts, true);
  }

  function add(cls, d) {
    var path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('class', cls);
    path.setAttribute('d', d);
    world.appendChild(path);
  }

  function buildGeography() {
    var base = document.createElementNS(SVGNS, 'rect');
    base.setAttribute('class', 'geo-land');
    base.setAttribute('x', '-84');
    base.setAttribute('y', String(py(45)));
    base.setAttribute('width', '9');
    base.setAttribute('height', String(py(37) - py(45)));
    world.appendChild(base);

    add('geo-home', pathFrom(GEO.pennsylvania, true));
    GEO.urban.forEach(function (u) { add('geo-urban', pathFrom(u, true)); });
    GEO.towns.forEach(function (t) { add('geo-urban', ellipse(t)); });
    GEO.parks.forEach(function (p) { add('geo-park', ellipse(p)); });
    add('geo-water', pathFrom(GEO.lakeErie, true));
    GEO.lakes.forEach(function (l) { add('geo-water', pathFrom(l, true)); });
    GEO.rivers.minor.forEach(function (r) { add('geo-river geo-river--minor', pathFrom(r)); });
    GEO.rivers.major.forEach(function (r) { add('geo-river', pathFrom(r)); });
    GEO.roads.major.forEach(function (r) { add('geo-road', pathFrom(r)); });
    GEO.roads.interstate.forEach(function (r) { add('geo-highway-case', pathFrom(r)); });
    GEO.roads.interstate.forEach(function (r) { add('geo-highway', pathFrom(r)); });
    svg.appendChild(world);
  }

  var labelNodes = LABELS.map(function (label) {
    var node = document.createElement('span');
    node.className = 'map-label map-label--' + label.cls.split(' ').join(' map-label--');
    node.textContent = label.t;
    node.setAttribute('aria-hidden', 'true');
    labelLayer.appendChild(node);
    label.p = project(label.lng, label.lat);
    label.node = node;
    label.shown = true;
    return label;
  });

  /* ------------------------------------------------------------------------
     Markers and clustering
     ------------------------------------------------------------------------ */
  var markerNodes = {};
  var clusterKey = '';
  var clusters = [];

  var bearIcon = '<svg viewBox="0 0 46 56" aria-hidden="true"><path class="pin__shape" d="M23 1.5C11.1 1.5 1.5 11 1.5 22.7c0 14.3 17.7 27.6 20.2 29.4a2.3 2.3 0 0 0 2.6 0C26.8 50.3 44.5 37 44.5 22.7 44.5 11 34.9 1.5 23 1.5z"/>' +
    '<circle class="pin__ear" cx="15.2" cy="14.6" r="4.3"/><circle class="pin__ear" cx="30.8" cy="14.6" r="4.3"/>' +
    '<circle class="pin__head" cx="23" cy="23.4" r="9.6"/><ellipse class="pin__muzzle" cx="23" cy="27" rx="4.6" ry="3.5"/>' +
    '<circle class="pin__eye" cx="19.4" cy="21.4" r="1.35"/><circle class="pin__eye" cx="26.6" cy="21.4" r="1.35"/><circle class="pin__eye" cx="23" cy="25.7" r="1.5"/></svg>';

  function computeClusters() {
    var radius = 68 / cam.k;
    var pool = visibleIds.map(function (id) { return byId[id]; });
    var out = [];
    var used = {};
    pool.forEach(function (location) {
      if (used[location.id]) return;
      var members = pool.filter(function (other) {
        if (used[other.id]) return false;
        var dx = other.p[0] - location.p[0];
        var dy = other.p[1] - location.p[1];
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });
      members.forEach(function (m) { used[m.id] = true; });
      var x = 0, y = 0;
      members.forEach(function (m) { x += m.p[0]; y += m.p[1]; });
      out.push({
        key: members.map(function (m) { return m.id; }).sort().join('|'),
        members: members,
        p: [x / members.length, y / members.length]
      });
    });
    return out;
  }

  function makeMarker(cluster) {
    var button = document.createElement('button');
    button.type = 'button';
    if (cluster.members.length > 1) {
      var names = cluster.members.map(function (m) { return m.name; }).join(', ');
      button.className = 'map-cluster';
      button.innerHTML = '<span>' + cluster.members.length + '</span>';
      button.setAttribute('aria-label', cluster.members.length + ' centers: ' + names + '. Zoom in');
      button.addEventListener('click', function () {
        animateTo(cameraForBounds(cluster.members.map(function (m) { return m.p; }), SELECT_K * 1.2), 650);
      });
    } else {
      var location = cluster.members[0];
      button.className = 'map-pin';
      button.dataset.id = location.id;
      button.innerHTML = bearIcon + '<span class="map-pin__name">' + location.name + '</span>';
      button.setAttribute('aria-label', 'Tender Care ' + location.name);
      button.addEventListener('click', function () { select(location.id, { fly: true, scrollList: true }); });
    }
    return button;
  }

  function syncMarkers() {
    var next = computeClusters();
    var key = next.map(function (c) { return c.key; }).join(',');
    clusters = next;
    if (key === clusterKey) return;
    clusterKey = key;
    var keep = {};
    clusters.forEach(function (cluster) {
      keep[cluster.key] = true;
      if (!markerNodes[cluster.key]) {
        markerNodes[cluster.key] = makeMarker(cluster);
        markerLayer.appendChild(markerNodes[cluster.key]);
      }
    });
    Object.keys(markerNodes).forEach(function (k) {
      if (keep[k]) return;
      if (markerNodes[k] === document.activeElement) mapEl.focus({ preventScroll: true });
      markerNodes[k].remove();
      delete markerNodes[k];
    });
    markActive();
  }

  function markActive() {
    Object.keys(markerNodes).forEach(function (k) {
      var node = markerNodes[k];
      var on = node.dataset.id === activeId;
      node.classList.toggle('is-active', on);
      node.setAttribute('aria-pressed', String(on));
      if (node.classList.contains('map-cluster')) {
        node.classList.toggle('has-active', k.split('|').indexOf(activeId) !== -1);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Draw
     ------------------------------------------------------------------------ */
  function draw() {
    if (!size.w) return;
    var k = cam.k;
    var tx = size.w / 2 - cam.x * k;
    var ty = size.h / 2 - cam.y * k;
    world.setAttribute('transform', 'matrix(' + k + ' 0 0 ' + k + ' ' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ')');

    var z = Math.log(k / 300) / Math.LN2;
    svg.style.setProperty('--w-highway', clamp(3 + z * 1.4, 2.2, 9).toFixed(2) + 'px');
    svg.style.setProperty('--w-case', clamp(5.4 + z * 1.8, 4, 12.5).toFixed(2) + 'px');
    svg.style.setProperty('--w-road', clamp(1.6 + z * 1.1, 1, 6).toFixed(2) + 'px');
    svg.style.setProperty('--w-river', clamp(4 + z * 2.4, 3, 16).toFixed(2) + 'px');
    svg.style.setProperty('--w-creek', clamp(2.2 + z * 1.3, 1.6, 7).toFixed(2) + 'px');

    syncMarkers();
    var spots = clusters.map(function (cluster) { return toScreen(cluster.p); });

    labelNodes.forEach(function (label) {
      var on = k >= (label.min || 0) && k <= (label.max || Infinity);
      var s = on ? toScreen(label.p) : null;
      if (s && (s[0] < -150 || s[0] > size.w + 150 || s[1] < -40 || s[1] > size.h + 40)) on = false;
      /* place names give way to centers: hide any label a marker sits on */
      if (on && !label.rot && label.cls !== 'state') {
        if (!label.width) label.width = label.node.offsetWidth || label.t.length * 8;
        var left = label.cls.indexOf('city') === 0 ? s[0] - 8 : s[0] - label.width / 2;
        var right = label.cls.indexOf('city') === 0 ? s[0] + label.width : s[0] + label.width / 2;
        on = !spots.some(function (m) { return m[0] > left - 22 && m[0] < right + 22 && m[1] > s[1] - 12 && m[1] < s[1] + 62; });
      }
      if (on !== label.shown) {
        label.node.style.display = on ? '' : 'none';
        label.shown = on;
      }
      if (on) {
        label.node.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px)' + (label.rot ? ' rotate(' + label.rot + 'deg)' : '');
      }
    });

    mapEl.classList.toggle('is-near', k >= 1500);
    clusters.forEach(function (cluster, i) {
      var node = markerNodes[cluster.key];
      var s = spots[i];
      node.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px)';
      node.style.visibility = s[0] < -60 || s[0] > size.w + 60 || s[1] < -60 || s[1] > size.h + 80 ? 'hidden' : '';
    });

    placePop();
  }

  /* the card sits above the pin, beside it, or below it — whichever fits whole */
  var PIN_H = 66;
  var GAP = 14;

  function popSpot(sx, sy, w, h) {
    var pad = inset();
    var minX = pad.l + 12, maxX = size.w - w - 12, minY = 12, maxY = size.h - h - 12;
    var options = [
      { side: 'above', x: clamp(sx - w / 2, minX, maxX), y: sy - PIN_H - GAP - h },
      { side: 'right', x: sx + 27 + GAP, y: clamp(sy - PIN_H / 2 - h / 2, minY, maxY) },
      { side: 'left', x: sx - 27 - GAP - w, y: clamp(sy - PIN_H / 2 - h / 2, minY, maxY) },
      { side: 'below', x: clamp(sx - w / 2, minX, maxX), y: sy + 44 }
    ];
    var overflow = function (o) {
      return Math.max(0, minX - o.x) + Math.max(0, o.x - maxX) + Math.max(0, minY - o.y) + Math.max(0, o.y - maxY);
    };
    options.sort(function (a, b) { return overflow(a) - overflow(b); });
    var best = options[0];
    best.x = clamp(best.x, minX, Math.max(minX, maxX));
    best.y = clamp(best.y, minY, Math.max(minY, maxY));
    return best;
  }

  function placePop() {
    if (!activeId || pop.hidden) return;
    var docked = mapEl.classList.contains('is-docked');
    var standalone = clusters.some(function (c) { return c.members.length === 1 && c.members[0].id === activeId; });
    pop.classList.toggle('is-tucked', !standalone && !docked);
    if (docked) { pop.style.transform = ''; return; }
    var s = toScreen(byId[activeId].p);
    var w = pop.offsetWidth;
    var h = pop.offsetHeight;
    var spot = popSpot(s[0], s[1], w, h);
    pop.dataset.side = spot.side;
    var vertical = spot.side === 'above' || spot.side === 'below';
    var tail = vertical ? clamp(s[0] - spot.x, 26, w - 26) : clamp(s[1] - PIN_H / 2 - spot.y, 26, h - 26);
    pop.style.setProperty('--tail', tail.toFixed(1) + 'px');
    pop.style.transform = 'translate(' + spot.x.toFixed(1) + 'px,' + spot.y.toFixed(1) + 'px)';
  }

  function resize() {
    var r = mapEl.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var first = !size.w;
    size.w = r.width;
    size.h = r.height;
    svg.setAttribute('viewBox', '0 0 ' + size.w + ' ' + size.h);
    mapEl.classList.toggle('is-docked', size.w < 620);
    if (first) cam = initialCamera();
    draw();
  }

  function initialCamera() {
    var preset = /[?&]center=([a-z-]+)/.exec(window.location.search);
    if (preset && byId[preset[1]]) {
      activeId = preset[1];
      window.setTimeout(function () { select(preset[1], { fly: false, scrollList: true }); }, 0);
      return cameraFor(byId[preset[1]].p, SELECT_K);
    }
    return cameraForBounds(locations.map(function (l) { return l.p; }), 900);
  }

  /* ------------------------------------------------------------------------
     Interaction: drag, pinch, wheel, keyboard, controls
     ------------------------------------------------------------------------ */
  function zoomAround(sx, sy, factor, duration) {
    var anchor = toWorld(sx, sy);
    var k = clamp(cam.k * factor, MIN_K, MAX_K);
    var target = { x: anchor[0] - (sx - size.w / 2) / k, y: anchor[1] - (sy - size.h / 2) / k, k: k };
    animateTo(target, duration);
  }

  function zoomCenter(factor) {
    var pad = inset();
    zoomAround(pad.l + (size.w - pad.l) / 2, size.h / 2, factor, 320);
  }

  var pointers = {};
  var gesture = null;

  function local(e) {
    var r = mapEl.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function startGesture() {
    var ids = Object.keys(pointers);
    if (!ids.length) { gesture = null; return; }
    var a = pointers[ids[0]];
    if (ids.length === 1) {
      gesture = { type: 'pan', start: a.slice(), cam: { x: cam.x, y: cam.y, k: cam.k }, moved: gesture && gesture.moved };
    } else {
      var b = pointers[ids[1]];
      var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      gesture = {
        type: 'pinch',
        dist: Math.max(10, Math.hypot(a[0] - b[0], a[1] - b[1])),
        anchor: toWorld(mid[0], mid[1]),
        k: cam.k,
        moved: true
      };
    }
  }

  mapEl.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a, [data-location-preview]')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    anim = null;
    pointers[e.pointerId] = local(e);
    mapEl.setPointerCapture(e.pointerId);
    startGesture();
  });

  mapEl.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId] || !gesture) return;
    pointers[e.pointerId] = local(e);
    var ids = Object.keys(pointers);
    if (gesture.type === 'pan' && ids.length === 1) {
      var p = pointers[ids[0]];
      var dx = p[0] - gesture.start[0];
      var dy = p[1] - gesture.start[1];
      if (!gesture.moved && Math.hypot(dx, dy) < 4) return;
      gesture.moved = true;
      mapEl.classList.add('is-dragging');
      cam = constrain({ x: gesture.cam.x - dx / cam.k, y: gesture.cam.y - dy / cam.k, k: cam.k });
      request();
    } else if (gesture.type === 'pinch' && ids.length > 1) {
      var a = pointers[ids[0]];
      var b = pointers[ids[1]];
      var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      var k = clamp(gesture.k * Math.hypot(a[0] - b[0], a[1] - b[1]) / gesture.dist, MIN_K, MAX_K);
      cam = constrain({ x: gesture.anchor[0] - (mid[0] - size.w / 2) / k, y: gesture.anchor[1] - (mid[1] - size.h / 2) / k, k: k });
      request();
    }
  });

  function endPointer(e) {
    if (!pointers[e.pointerId]) return;
    delete pointers[e.pointerId];
    mapEl.classList.remove('is-dragging');
    startGesture();
  }
  mapEl.addEventListener('pointerup', endPointer);
  mapEl.addEventListener('pointercancel', endPointer);

  mapEl.addEventListener('dblclick', function (e) {
    if (e.target.closest('button, a, [data-location-preview]')) return;
    var p = local(e);
    zoomAround(p[0], p[1], e.shiftKey ? .5 : 2, 360);
  });

  mapEl.addEventListener('wheel', function (e) {
    e.preventDefault();
    anim = null;
    var p = local(e);
    var delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    var anchor = toWorld(p[0], p[1]);
    var k = clamp(cam.k * Math.exp(-delta * .0022), MIN_K, MAX_K);
    cam = constrain({ x: anchor[0] - (p[0] - size.w / 2) / k, y: anchor[1] - (p[1] - size.h / 2) / k, k: k });
    request();
  }, { passive: false });

  mapEl.addEventListener('keydown', function (e) {
    if (e.target !== mapEl) return;
    var step = 90 / cam.k;
    var moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      animateTo({ x: cam.x + moves[e.key][0], y: cam.y + moves[e.key][1], k: cam.k }, 180);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomCenter(2);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomCenter(.5);
    }
  });

  finder.querySelector('[data-map-zoom-in]').addEventListener('click', function () { zoomCenter(2); });
  finder.querySelector('[data-map-zoom-out]').addEventListener('click', function () { zoomCenter(.5); });
  finder.querySelector('[data-map-reset]').addEventListener('click', function () {
    closePop();
    var ids = visibleIds.length ? visibleIds : locations.map(function (l) { return l.id; });
    animateTo(cameraForBounds(ids.map(function (id) { return byId[id].p; }), 900), 650);
  });

  /* ------------------------------------------------------------------------
     List, search, selection
     ------------------------------------------------------------------------ */
  function directionsUrl(location) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location.address);
  }

  function telHref(phone) { return 'tel:+1' + phone.replace(/\D/g, ''); }

  function miles(a, b) {
    var r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r;
    var dLng = (b.lng - a.lng) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function setLink(a, href) {
    a.href = href;
    if (linkTarget) a.target = linkTarget;
  }

  function renderList() {
    results.innerHTML = '';
    var list = visibleIds.map(function (id) { return byId[id]; });
    if (origin) list.sort(function (a, b) { return miles(origin, a) - miles(origin, b); });
    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'tc-results__empty';
      empty.textContent = 'No centers match that search. Try a city, center name, or ZIP code.';
      results.appendChild(empty);
      return;
    }
    list.forEach(function (location) {
      var card = document.createElement('article');
      card.className = 'tc-card' + (location.id === activeId ? ' is-active' : '');
      card.dataset.locationId = location.id;
      var distance = origin ? '<b>' + miles(origin, location).toFixed(1) + ' mi away</b> · ' : '';
      card.innerHTML =
        '<button type="button" class="tc-card__select" aria-pressed="' + (location.id === activeId) + '"><span class="sr-only">Show ' + location.name + ' on the map</span></button>' +
        '<div class="tc-card__top">' +
          '<h3 class="tc-card__name"><a data-page>' + location.name + ' <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a></h3>' +
          '<img class="tc-card__photo" src="' + location.image + '" alt="" loading="lazy">' +
        '</div>' +
        '<p class="tc-card__line"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>' + distance + location.address + '</span></p>' +
        '<p class="tc-card__line"><i class="fa-solid fa-phone" aria-hidden="true"></i><a data-phone>' + location.phone + '</a></p>' +
        '<div class="tc-card__actions">' +
          '<a class="btn btn--rose btn--sm" data-page-btn>View center <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
          '<a class="tc-card__directions" data-directions target="_blank" rel="noopener">Directions <i class="fa-solid fa-diamond-turn-right" aria-hidden="true"></i></a>' +
        '</div>';
      setLink(card.querySelector('[data-page]'), 'locations/' + location.id + '.html');
      setLink(card.querySelector('[data-page-btn]'), 'locations/' + location.id + '.html');
      card.querySelector('[data-phone]').href = telHref(location.phone);
      card.querySelector('[data-directions]').href = directionsUrl(location);
      card.querySelector('.tc-card__select').addEventListener('click', function () {
        select(location.id, { fly: true, showMap: true });
      });
      results.appendChild(card);
    });
  }

  function updateStatus() {
    var count = visibleIds.length;
    var label = count + (count === 1 ? ' center' : ' centers');
    status.textContent = origin ? label + ', nearest first' : label;
  }

  function openPop(location) {
    popImage.src = location.image;
    popImage.alt = 'Tender Care ' + location.name;
    popName.textContent = location.name;
    popAddress.textContent = location.address;
    popPhone.textContent = location.phone;
    popPhone.href = telHref(location.phone);
    setLink(popPage, 'locations/' + location.id + '.html');
    popDirections.href = directionsUrl(location);
    pop.hidden = false;
    placePop();
  }

  /* frame the pin and its card together in the middle of the open map area */
  function focusCamera(location) {
    var k = Math.max(cam.k, SELECT_K);
    var pad = inset();
    var cx = pad.l + (size.w - pad.l) / 2;
    var cy = size.h / 2;
    var sx = cx, sy = cy;
    if (mapEl.classList.contains('is-docked')) {
      sy = Math.max(PIN_H + 20, (size.h - pop.offsetHeight - 24) / 2 + PIN_H / 2);
    } else {
      var w = pop.offsetWidth, h = pop.offsetHeight;
      if (PIN_H + GAP + h + 48 <= size.h) sy = cy + (PIN_H + GAP + h) / 2;
      else { sx = cx - (GAP + w) / 2; sy = cy + PIN_H / 2; }
    }
    return constrain({ x: location.p[0] - (sx - size.w / 2) / k, y: location.p[1] - (sy - size.h / 2) / k, k: k });
  }

  popImage.addEventListener('load', placePop);

  function closePop() {
    activeId = null;
    pop.hidden = true;
    markActive();
    results.querySelectorAll('.tc-card').forEach(function (card) {
      card.classList.remove('is-active');
      card.querySelector('.tc-card__select').setAttribute('aria-pressed', 'false');
    });
  }

  function select(id, opts) {
    var location = byId[id];
    if (!location) return;
    opts = opts || {};
    activeId = id;
    if (visibleIds.indexOf(id) === -1) {
      search.value = '';
      applyFilter(false);
    }
    results.querySelectorAll('.tc-card').forEach(function (card) {
      var on = card.dataset.locationId === id;
      card.classList.toggle('is-active', on);
      card.querySelector('.tc-card__select').setAttribute('aria-pressed', String(on));
      if (on && opts.scrollList) {
        var top = card.offsetTop - results.offsetTop - 12;
        results.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    if (opts.showMap) setView('map');
    markActive();
    openPop(location);
    if (opts.fly) animateTo(focusCamera(location), 700);
  }

  /* punctuation-free matching keeps "mt lebanon" and "Mt. Lebanon" equivalent */
  function plain(text) { return text.toLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim(); }
  locations.forEach(function (location) {
    location.haystack = plain(location.name + ' ' + location.address + ' ' + (location.address.indexOf(', WV') !== -1 ? 'West Virginia' : 'Pennsylvania'));
  });

  var fitTimer = null;
  function applyFilter(fit) {
    var query = plain(search.value);
    var words = query ? query.split(' ') : [];
    visibleIds = locations.filter(function (location) {
      return words.every(function (word) { return location.haystack.indexOf(word) !== -1; });
    }).map(function (location) { return location.id; });
    clear.hidden = !search.value;
    if (activeId && visibleIds.indexOf(activeId) === -1) closePop();
    clusterKey = '';
    updateStatus();
    renderList();
    draw();
    window.clearTimeout(fitTimer);
    if (fit && visibleIds.length) {
      fitTimer = window.setTimeout(function () {
        if (visibleIds.length === 1) {
          select(visibleIds[0], { fly: true });
        } else {
          animateTo(cameraForBounds(visibleIds.map(function (id) { return byId[id].p; }), query ? SELECT_K : 900), 600);
        }
      }, 280);
    }
  }

  search.addEventListener('input', function () { applyFilter(true); });
  search.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && search.value) {
      search.value = '';
      applyFilter(true);
    }
    if (e.key === 'Enter' && visibleIds.length) {
      e.preventDefault();
      select(visibleIds[0], { fly: true, showMap: true });
    }
  });
  clear.addEventListener('click', function () {
    search.value = '';
    applyFilter(true);
    search.focus();
  });

  pop.querySelector('[data-location-close]').addEventListener('click', closePop);

  if (near) {
    if (!('geolocation' in navigator)) {
      near.hidden = true;
    } else {
      near.addEventListener('click', function () {
        near.disabled = true;
        near.classList.add('is-busy');
        navigator.geolocation.getCurrentPosition(function (position) {
          near.disabled = false;
          near.classList.remove('is-busy');
          origin = { lat: position.coords.latitude, lng: position.coords.longitude };
          search.value = '';
          applyFilter(false);
          var nearest = visibleIds.slice().sort(function (a, b) { return miles(origin, byId[a]) - miles(origin, byId[b]); })[0];
          results.scrollTop = 0;
          select(nearest, { fly: true });
        }, function () {
          near.disabled = false;
          near.classList.remove('is-busy');
          status.textContent = 'Location is unavailable. Search by city, center, or ZIP instead.';
        }, { timeout: 9000, maximumAge: 600000 });
      });
    }
  }

  /* small screens switch between the list and the map */
  function setView(view) {
    finder.dataset.view = view;
    viewButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.locationView === view));
    });
    if (view === 'map') resize();
  }
  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () { setView(button.dataset.locationView); });
  });

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */
  buildGeography();
  setView('list');
  updateStatus();
  renderList();
  mapEl.classList.add('is-ready');

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { resize(); }).observe(mapEl);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();
})();
