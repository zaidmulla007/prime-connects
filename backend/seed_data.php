<?php
/**
 * Prime Connects — Full Data Seeder
 * Run: php seed_data.php  (from backend/ directory)
 */
declare(strict_types=1);

$host = '127.0.0.1';
$db   = 'primeconnects';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage() . "\n");
}

$now = date('Y-m-d H:i:s');

// ── TRUNCATE ─────────────────────────────────────────────────────────────────
$pdo->exec("SET FOREIGN_KEY_CHECKS=0");
foreach (['product_specs','product_images','products','categories','banners','certificates','projects','inquiries'] as $t) {
    $pdo->exec("TRUNCATE TABLE `$t`");
    echo "Truncated: $t\n";
}
$pdo->exec("SET FOREIGN_KEY_CHECKS=1");

// ── CATEGORIES ────────────────────────────────────────────────────────────────
// [id, name, slug, description, image_url, parent_id, type, sort_order, depth, path]
$cats = [
    // ─ PARENT CATEGORIES ─
    [1,  'Doors',                        'doors',                      'Premium quality doors including MDF, WPC, Steel, Wooden, Aluminium, and Emergency Exit doors.',        '/uploads/home/doors.jpg',                                         null, 'category', 1, 0, '1'],
    [2,  'Color Card',                   'color-card',                 'Wide range of colors and premium finishes for doors and cabinets.',                                     '/uploads/home/color-card.webp',                                   null, 'category', 2, 0, '2'],
    [3,  'Doors Hardware & Accessories', 'door-hardware',              'Complete range of door mechanisms, hinges, handles, and smart locks.',                                  '/uploads/home/hardware-accessories.jpg',                          null, 'category', 3, 0, '3'],
    [4,  'Kitchen Cabinets',             'kitchen-cabinets',           'Durable and stylish cabinets for an organized kitchen.',                                                '/uploads/home/cabinet.jpg',                                       null, 'category', 4, 0, '4'],
    [5,  'Wardrobes',                    'wardrobes',                  'Smart storage solutions for everyday style with customizable designs.',                                  '/uploads/home/wardrobe.jpg',                                      null, 'category', 5, 0, '5'],
    [6,  'Core Panels',                  'core-panels',                'MDF, MR MDF, Plywood, Film Faced, and Melamine panels for various applications.',                       '/uploads/home/core-panels.jpg',                                   null, 'category', 6, 0, '6'],

    // ─ DOORS sub-categories ─
    [7,  'MDF Doors',                    'mdf-doors',                  'Medium Density Fiberboard doors with smooth paintable surfaces and fire-rated options FD30/FD60/FD120.', '/uploads/doors/mdf-doors/MDFD001.jpg',                           1, 'category', 1, 1, '1/7'],
    [8,  'WPC Doors',                    'wpc-doors',                  'Wood Plastic Composite doors — 100% waterproof, anti-termite, soundproof, and eco-friendly.',            '/uploads/doors/wpc-doors/WPCD001.jpg',                           1, 'category', 2, 1, '1/8'],
    [9,  'Iron & Steel Doors',           'iron-and-steel-doors',       'Heavy-duty steel frame fire doors with smoke seal, fire lock, and honeycomb core. FD60/FD90/FD120.',   '/uploads/doors/iron-steel-doors/I&SD001.jpg',                    1, 'category', 3, 1, '1/9'],
    [10, 'Wooden Doors',                 'wooden-doors',               'Premium solid wood doors with consistent grain, dowel joinery, and floating panel system. FD30/FD60.', '/uploads/doors/wooden-doors/WDND001.jpg',                        1, 'category', 4, 1, '1/10'],
    [11, 'Aluminium Doors',              'aluminium-doors',            'Rust-free lightweight aluminium doors with 5-chamber sash and 40-year life expectancy. FD30/FD60.',    '/uploads/doors/aluminium-doors/ALD001.jpg',                      1, 'category', 5, 1, '1/11'],
    [12, 'Emergency Exit Doors',         'emergency-exit-doors',       'Fire-rated emergency exit doors with panic bar hardware and self-closing mechanism. FD60/FD90/FD120.', '/uploads/doors/emergency-doors/EMGD001.jpg',                     1, 'category', 6, 1, '1/12'],
    [13, 'Glass Doors',                  'glass-doors',                'Elegant glass doors combining aesthetics with functionality for modern interiors.',                     '/uploads/doors/glass-doors/gl1.jpg',                             1, 'category', 7, 1, '1/13'],

    // ─ HARDWARE sub-categories ─
    [14, 'Door Handles',                 'door-handles',               'Premium door handles in multiple finishes: polished gold, brushed silver, bronze, and matte black.',   '/uploads/door-mech-access/door-handles/DH001.jpg',               3, 'category', 1, 1, '3/14'],
    [15, 'Door Hinges',                  'door-hinges',                'Heavy-duty door hinges in concealed and visible options with corrosion resistance.',                    '/uploads/door-mech-access/door-hinges/DHG001.jpg',               3, 'category', 2, 1, '3/15'],
    [16, 'Smart Locks',                  'smart-locks',                'Advanced smart locks with fingerprint recognition, PIN access, and remote smartphone control.',         '/uploads/door-mech-access/doors-with-smart-lock/DSL001.jpg',     3, 'category', 3, 1, '3/16'],

    // ─ KITCHEN sub-categories ─
    [17, 'Kitchen Cabinets',             'kitchen-cabinets-products',  'Premium kitchen cabinets with soft-close hinges, adjustable shelving, and water-resistant materials.', '/uploads/kitchen-cabinets/KC001.jpg',                            4, 'category', 1, 1, '4/17'],
    [18, 'Bar Cabinets',                 'bar-cabinets',               'Elegant bar cabinets and entertainment units for style and functionality.',                             '/uploads/barcabinet/barc-001.jpg',                               4, 'category', 2, 1, '4/18'],

    // ─ WARDROBES sub-categories ─
    [19, 'Wardrobes & Closets',          'wardrobes-closets',          'Walk-in and built-in wardrobes with LED lighting, hanging spaces, and organized storage.',             '/uploads/wardrobes/CLOSET001.jpg',                               5, 'category', 1, 1, '5/19'],

    // ─ CORE PANELS sub-categories ─
    [20, 'MDF Core Panel',               'mdf-core-panel',             'Smooth surface MDF panels ideal for painting, laminating, and veneering. Eco-friendly.',               '/uploads/core-panels/mdfcorepanel/mdf-001.jpg',                  6, 'category', 1, 1, '6/20'],
    [21, 'MR MDF Core Panel',            'mr-mdf-core-panel',          'Moisture Resistant MDF with improved dimensional stability for humid environments.',                   '/uploads/core-panels/mrmdfcorepanel/mrmdf-001.jpg',              6, 'category', 2, 1, '6/21'],
    [22, 'Marine & Construction Plywood','marine-construction-plywood','Superior waterproof marine-grade plywood for construction applications.',                              '/uploads/core-panels/marinaconstractionPLYWOOD/CNT-001.jpg',     6, 'category', 3, 1, '6/22'],
    [23, 'Core Panel Plywood',           'core-panel-plywood',         'Strong and stable layered wood veneer core plywood for interior construction.',                        '/uploads/core-panels/CORE-PANEL-PLYWOOD/CPP-001.jpg',            6, 'category', 4, 1, '6/23'],
    [24, 'Film Faced MDF Panels',        'film-faced-mdf-panels',      'Moisture and abrasion resistant MDF with smooth film surface for formwork applications.',              '/uploads/core-panels/FILMFACEDMDFPANELS/ffmp-001.jpg',           6, 'category', 5, 1, '6/24'],
    [25, 'Melamine Faced MDF Panels',    'melamine-faced-mdf-panels',  'Scratch and stain resistant decorative melamine MDF available in wide colors and patterns.',           '/uploads/core-panels/MelamineFacedMDFPanels/mfmp-001.jpg',       6, 'category', 6, 1, '6/25'],
    [26, 'Film Faced Plywood',           'film-faced-plywood',         'Durable water-resistant plywood with protective phenolic film coating for formwork.',                  '/uploads/core-panels/FilmFacedPlywood/FFP-001.jpg',              6, 'category', 7, 1, '6/26'],
    [27, 'Melamine Faced Plywood',       'melamine-faced-plywood',     'High-end furniture grade plywood with elegant melamine surface in wide color range.',                  '/uploads/core-panels/MelamineFacedPlywood/mfp-001.jpg',          6, 'category', 8, 1, '6/27'],
    [28, 'Solid Chip Board',             'solid-chip-board',           'High-density solid chip board panels for construction and furniture applications.',                    '/uploads/core-panels/solid-chip-board/scb-001.jpg',              6, 'category', 9, 1, '6/28'],
];

$stmt = $pdo->prepare("INSERT INTO categories (id, name, slug, description, image_url, parent_id, type, sort_order, depth, path, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
foreach ($cats as $c) {
    $stmt->execute([$c[0], $c[1], $c[2], $c[3], $c[4], $c[5], $c[6], $c[7], $c[8], $c[9], $now, $now]);
}
echo "Categories inserted: " . count($cats) . "\n";

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
// [id, name, slug, sku, description, category_id]
$products = [
    // DOORS
    [1,  'MDF Doors',                    'mdf-doors',                 'MDFD-001', 'Premium quality Medium Density Fiberboard doors featuring smooth paintable surfaces, excellent sound reduction properties, and fire-rated options. No raised grain, reduces sound transmission, and available in FD30, FD60, and FD120 fire ratings.',                                                                                   7],
    [2,  'WPC Doors',                    'wpc-doors',                 'WPCD-001', '100% waterproof Wood Plastic Composite doors that are completely anti-termite, soundproof, and eco-friendly. Made from non-formaldehyde materials for a healthy indoor environment. Features PVC film surface with PU foam core for superior durability.',                                                                         8],
    [3,  'Iron & Steel Doors',           'iron-and-steel-doors',      'ISD-001',  'Heavy-duty steel frame fire doors with integrated smoke seal, fire lock mechanism, and high-density honeycomb core. Provides maximum fire protection rated at FD60, FD90, and FD120. Ideal for commercial buildings, stairwells, and fire compartments.',                                                                          9],
    [4,  'Wooden Doors',                 'wooden-doors',              'WDD-001',  'Premium solid wood doors crafted with consistent grain, precision dowel joinery, engineered core, and edge-glued solid wood construction. Floating panel system prevents warping. Available in FD30 and FD60 fire ratings with TruStile construction.',                                                                           10],
    [5,  'Aluminium Doors',              'aluminium-doors',           'ALD-001',  'Rust-free, lightweight aluminium doors requiring minimal maintenance. Features 5-chamber sash profile for superior thermal and acoustic performance with a 40-year life expectancy. Glazing options from 24mm to 44mm. Rated FD30 and FD60.',                                                                                    11],
    [6,  'Emergency Exit Doors',         'emergency-exit-doors',      'EMD-001',  'Fire-rated emergency exit doors equipped with panic bar hardware and self-closing mechanism for rapid and safe egress. Meets all international safety regulations. 55mm thickness for 2-hour fire rating. Available in FD60, FD90, and FD120.',                                                                                   12],
    [7,  'Glass Doors',                  'glass-doors',               'GLD-001',  'Elegant glass doors for modern interior design combining aesthetic appeal with functional performance. Suitable for offices, showrooms, commercial spaces, and contemporary residential interiors.',                                                                                                                              13],

    // HARDWARE
    [8,  'Door Handles',                 'door-handles',              'DH-001',   'Premium quality door handles and lever sets available in multiple elegant finishes including polished gold, brushed silver, antique bronze, and matte black. Wide selection of decorative designs to complement every interior style from classic to contemporary.',                                                               14],
    [9,  'Door Hinges',                  'door-hinges',               'DHG-001',  'Heavy-duty door hinges in a variety of sizes and profiles for residential and commercial applications. Available in concealed and surface-mounted options with excellent corrosion resistance. Multiple finish options to match door hardware.',                                                                                    15],
    [10, 'Smart Locks',                  'smart-locks',               'DSL-001',  'Advanced smart door locks featuring multiple access methods including fingerprint recognition, PIN code, RFID card, and remote smartphone control via mobile app. Auto-lock function, tamper alarm, and low battery notification for complete peace of mind.',                                                                    16],

    // KITCHEN
    [11, 'Kitchen Cabinets',             'kitchen-cabinets-products', 'KC-001',   'Premium kitchen cabinets available in multiple configurations including base units, wall-mounted cabinets, and tall pantry cabinets. Features soft-close hinges and drawer runners, adjustable shelving, and water-resistant board construction. Available in contemporary high-gloss and matte finishes.',                       17],
    [12, 'Bar Cabinets',                 'bar-cabinets',              'BC-001',   'Elegant bar cabinets and entertainment units designed for style and functionality. Perfect for home bars, dining rooms, and entertainment spaces. Features glass holders, bottle storage, and premium finishes to elevate any interior.',                                                                                        18],

    // WARDROBES
    [13, 'Wardrobes & Closets',          'wardrobes',                 'WRB-001',  'Fully customizable wardrobe solutions including walk-in and built-in closet designs. Features integrated LED lighting, multiple hanging rail heights, drawer organizers with soft-close runners, and dedicated compartments for shoes, accessories, and jewelry. Available in sliding and hinged door configurations.',           19],

    // COLOR CARD
    [14, 'Color Card',                   'color-card',                'CC-001',   'Comprehensive collection of 32 premium colors and finishes for doors and cabinets. Selection spans from pure whites (Snow White, Ivory, Cream) to warm wood tones (Natural Wood, Oak, Honey Wood) to sophisticated darks (Charcoal, Dark Grey, Black). Each color is available in smooth and textured finishes.',               2],

    // CORE PANELS
    [15, 'MDF Core Panel',               'mdf-core-panel',            'MCP-001',  'Premium Medium Density Fiberboard with smooth surface for painting, laminating, and veneering. Easy to cut and shape with excellent edge quality. Cost-effective, eco-friendly, and consistent density throughout. Ideal for furniture, cabinetry, and interior joinery.',                                                        20],
    [16, 'MR MDF Core Panel',            'mr-mdf-core-panel',         'MRMDF-001','Moisture Resistant MDF with improved dimensional stability for humid environments. Green-tinted core indicates moisture-resistant adhesive binder. Suitable for bathrooms, kitchens, laundries, and other areas exposed to moisture. Maintains structural integrity where standard MDF would swell.',                            21],
    [17, 'Marine & Construction Plywood','marine-construction-plywood','MCP-002',  'Superior waterproof plywood manufactured with exterior-grade adhesive for marine and heavy construction applications. Film-faced on both sides for added protection. High strength-to-weight ratio with minimal core voids. Available in multiple thicknesses for diverse structural applications.',                            22],
    [18, 'Core Panel Plywood',           'core-panel-plywood',        'CPP-001',  'Strong and stable layered wood veneer core plywood with excellent structural integrity and screw-holding capacity. Ideal for interior construction, partitions, flooring, and furniture manufacturing. Consistent thickness and smooth surface for quality finishes.',                                                          23],
    [19, 'Film Faced MDF Panels',        'film-faced-mdf-panels',     'FFMDF-001','Moisture and abrasion resistant MDF panels with smooth phenolic film surface coating on one or both faces. Reusable panels designed for concrete formwork and demanding construction applications. Film prevents adhesion to concrete allowing clean release.',                                                                  24],
    [20, 'Melamine Faced MDF Panels',    'melamine-faced-mdf-panels', 'MFMDF-001','Decorative melamine surface MDF panels that are scratch, stain, and impact resistant. Available in extensive range of solid colors and wood grain patterns. No additional painting, staining, or finishing required. Ready-to-use for furniture, shop fitting, and interior design.',                                         25],
    [21, 'Film Faced Plywood',           'film-faced-plywood',        'FFP-001',  'Durable water-resistant plywood with WBP phenolic film coating on both faces for maximum protection. Designed for heavy-duty concrete formwork with multiple reuses. Available in standard and custom thicknesses. Film available in brown (tropical) and black (Nordic) grades.',                                              26],
    [22, 'Melamine Faced Plywood',       'melamine-faced-plywood',    'MFP-001',  'High-end furniture grade plywood with factory-applied decorative melamine surface. Combines the structural strength of plywood with the aesthetic appeal of melamine. Scratch and stain resistant for demanding applications. Available in extensive color and wood grain options.',                                            27],
    [23, 'Solid Chip Board',             'solid-chip-board',          'SCB-001',  'High-density solid chip board (particle board) manufactured from wood chips and synthetic resin binders under high pressure. Uniform density and smooth surface makes it ideal for melamine laminating, furniture panels, shelving, and interior construction applications.',                                                    28],
];

$stmtProd = $pdo->prepare("INSERT INTO products (id, name, slug, sku, description, category_id, is_active, created_at, updated_at) VALUES (?,?,?,?,?,?,1,?,?)");
foreach ($products as $p) {
    $stmtProd->execute([$p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $now, $now]);
}
echo "Products inserted: " . count($products) . "\n";

// ── PRODUCT IMAGES ────────────────────────────────────────────────────────────
$productImages = [
    1  => ['/uploads/doors/mdf-doors/',                           ['MDFD001.jpg','MDFD002.jpg','MDFD003.jpg','MDFD004.jpg','MDFD005.jpg','MDFD006.jpg','MDFD007.jpg','MDFD008.jpg','MDFD009.jpg','MDFD011.jpg','MDFD012.jpg','MDFD013.jpg','MDFD014.jpg','MDFD014.png']],
    2  => ['/uploads/doors/wpc-doors/',                           ['WPCD001.jpg','WPCD002.jpg','WPCD003.jpg','WPCD004.jpg','WPCD005.jpg','WPCD006.jpg','WPCD007.jpg','WPCD008.jpg','WPCD009.jpg','WPCD010.jpg','WPCD011.jpg','WPCD012.jpg']],
    3  => ['/uploads/doors/iron-steel-doors/',                    ['I&SD001.jpg','I&SD002.jpg','I&SD003.jpg','I&SD004.jpg','I&SD005.jpg','I&SD006.jpg','I&SD007.jpg','I&SD008.jpg','I&SD009.jpg','I&SD010.jpg','I&SD011.jpg','I&SD012.jpg','I&SD013.jpg','I&SD014.jpg','I&SD015.jpg']],
    4  => ['/uploads/doors/wooden-doors/',                        ['WDND001.jpg','WDND002.jpg','WDND003.jpg','WDND004.jpg','WDND005.jpg','WDND006.jpg','WDND007.jpg','WDND008.jpg','WDND009.jpg','WDND010.jpg','WDND011.jpg','WDND012.jpg','WDND013.jpg','WDND014.jpg','WDND015.jpg']],
    5  => ['/uploads/doors/aluminium-doors/',                     ['ALD001.jpg','ALD002.jpg','ALD003.jpg','ALD004.jpg','ALD005.jpg','ALD006.jpg','ALD007.jpg','ALD008.jpg','ALD009.jpg','ALD010.jpg','ALD011.jpg','ALD012.jpg','ALD013.jpg','ALD014.jpg','ALD015.jpg','ALD016.jpg','ALD017.jpg','ALD018.jpg','ALD019.jpg','ALD020.jpg']],
    6  => ['/uploads/doors/emergency-doors/',                     ['EMGD001.jpg','EMGD002.jpg','EMGD003.jpg','EMGD004.jpg']],
    7  => ['/uploads/doors/glass-doors/',                         ['gl1.jpg','gl2.jpg','gl3.jpg','gl4.jpg','gl5.jpg','gl6.jpg','gl7.jpg','gl8.jpg','gl9.jpg','gl10.jpg','gl11.jpg','gl12.jpg','gl13.jpg','gl14.jpg']],
    8  => ['/uploads/door-mech-access/door-handles/',             ['DH001.jpg','DH002.jpg','DH003.jpg','DH004.jpg','DH005.jpg','DH006.jpg','DH008.jpg','DH009.jpg','DH010.png','DH011.png','DH012.png']],
    9  => ['/uploads/door-mech-access/door-hinges/',              ['DHG001.jpg','DHG002.jpg','DHG003.jpg','DHG005.jpg','DHG006.jpg','DHG007.jpg','DHG008.jpg','DHG010.jpeg','DHG011.jpeg','DHG012.jpeg','DHG013.jpeg','DHG014.jpeg','DHG015.jpg']],
    10 => ['/uploads/door-mech-access/doors-with-smart-lock/',   ['DSL001.jpg','DSL002.jpg','DSL003.jpg','DSL004.jpg','DSL005.jpg']],
    11 => ['/uploads/kitchen-cabinets/',                          ['KC001.jpg','KC003.jpg','KC004.jpg','KC005.jpg','KC006.jpg','KC007.jpg','KC009.jpg','KC010.jpg','KC011.jpg','KC012.jpg','KC013.jpg','KC015.jpg','KC017.jpg','KC018.jpg','KC019.jpg','KC020.jpg','KC021.jpg','KC022.jpg','KC023.jpg','KC025.jpg','KC026.jpg','KC027.jpg','KC028.jpg']],
    12 => ['/uploads/barcabinet/',                                ['barc-001.jpg','barc-002.jpg','barc-003.jpg','barc-004.jpg','barc-005.jpg','barc-006.jpg','barc-007.jpg','barc-008.jpg','barc-009.jpg','barc-010.jpg','barc-011.jpg','barc-012.jpg','barc-013.avif','barc-014.jpg','barc-015.jpg']],
    13 => ['/uploads/wardrobes/',                                 ['CLOSET001.jpg','CLOSET002.jpg','CLOSET003.jpg','CLOSET004.jpg','CLOSET005.jpg','CLOSET006.jpg','CLOSET007.jpg','CLOSET008.jpg','CLOSET009.jpg','CLOSET011.jpg','CLOSET012.jpg','CLOSET013.jpg']],
    14 => ['/uploads/color-card/',                                ['CLRC001.jpg','CLRC002.jpg','CLRC003.jpg','CLRC004.jpg','CLRC005.jpg','CLRC006.jpg','CLRC007.jpg','CLRC008.jpg','CLRC009.jpg','CLRC010.jpg','CLRC011.jpg','CLRC012.jpg','CLRC013.jpg','CLRC014.jpg','CLRC015.jpg','CLRC016.jpg','CLRC017.jpg','CLRC018.jpg','CLRC019.jpg','CLRC020.jpg','CLRC021.jpg','CLRC022.jpg','CLRC023.jpg','CLRC024.jpg','CLRC025.jpg','CLRC026.jpg','CLRC027.jpg','CLRC028.jpg','CLRC029.jpg','CLRC030.jpg']],
    15 => ['/uploads/core-panels/mdfcorepanel/',                  ['mdf-001.jpg','mdf-002.jpg','mdf-003.jpg','mdf-004.jpg','mdf-005.jpg']],
    16 => ['/uploads/core-panels/mrmdfcorepanel/',                ['mrmdf-001.jpg','mrmdf-002.jpg','mrmdf-003.jpg','mrmdf-004.jpg','mrmdf-005.jpg','mrmdf-006.jpg','mrmdf-007.jpg','mrmdf-008.jpg','mrmdf-009.jpg']],
    17 => ['/uploads/core-panels/marinaconstractionPLYWOOD/',     ['CNT-001.jpg','CNT-002.jpg','CNT-003.jpg','CNT-004.jpg','CNT-005.jpg','CNT-006.jpg','CNT-007.jpg','CNT-008.jpg','CNT-009.jpg']],
    18 => ['/uploads/core-panels/CORE-PANEL-PLYWOOD/',            ['CPP-001.jpg','CPP-002.jpg','CPP-003.jpg','CPP-004.jpg','CPP-005.jpg']],
    19 => ['/uploads/core-panels/FILMFACEDMDFPANELS/',            ['ffmp-001.jpg','ffmp-002.jpg','ffmp-003.jpg','ffmp-004.jpg','ffmp-005.jpg','ffmp-006.jpg','ffmp-007.jpg','ffmp-008.jpg','ffmp-009.jpg']],
    20 => ['/uploads/core-panels/MelamineFacedMDFPanels/',        ['mfmp-001.jpg','mfmp-002.jpg','mfmp-003.jpg','mfmp-004.jpg','mfmp-005.jpg','mfmp-006.jpg','mfmp-007.jpg']],
    21 => ['/uploads/core-panels/FilmFacedPlywood/',              ['FFP-001.jpg','FFP-002.jpg','FFP-003.jpg','FFP-004.jpg','FFP-005.jpg','FFP-006.jpg','FFP-007.jpg']],
    22 => ['/uploads/core-panels/MelamineFacedPlywood/',          ['mfp-001.jpg','mfp-002.jpg','mfp-003.jpg','mfp-004.jpg','mfp-005.jpg','mfp-006.jpg']],
    23 => ['/uploads/core-panels/solid-chip-board/',              ['scb-001.jpg','scb-002.jpg']],
];

$productNames = [];
foreach ($products as $p) { $productNames[$p[0]] = $p[1]; }

$stmtImg = $pdo->prepare("INSERT INTO product_images (product_id, url, alt, sort_order, created_at) VALUES (?,?,?,?,?)");
$imgCount = 0;
foreach ($productImages as $productId => [$basePath, $files]) {
    foreach ($files as $i => $file) {
        $stmtImg->execute([$productId, $basePath . $file, $productNames[$productId] ?? '', $i + 1, $now]);
        $imgCount++;
    }
}
echo "Product images inserted: $imgCount\n";

// ── PRODUCT SPECS ─────────────────────────────────────────────────────────────
$specs = [
    1 => [ // MDF Doors
        ['Fire Rating',      'FD30 / FD60 / FD120',  ''],
        ['Material',         'MDF with Wood Veneer',  ''],
        ['Surface',          'Smooth Paintable',       ''],
        ['Sound Reduction',  'Up to 42 dB',            'dB'],
        ['Core',             'High Density MDF',       ''],
    ],
    2 => [ // WPC Doors
        ['Material',          'WPC Panel + Wood',       ''],
        ['Thickness',         '30 / 35 mm',             'mm'],
        ['Surface',           'PVC Film',               ''],
        ['Core',              'PU Foam',                ''],
        ['Water Resistance',  '100% Moisture Proof',    ''],
        ['Environmental',     'Non-Formaldehyde',       ''],
    ],
    3 => [ // Iron & Steel Doors
        ['Fire Rating',   'FD60 / FD90 / FD120',   ''],
        ['Material',      'Steel / Iron Frame',      ''],
        ['Core',          'High Density Honeycomb',  ''],
        ['Smoke Seal',    'Integrated',              ''],
        ['Fire Lock',     'Included',                ''],
    ],
    4 => [ // Wooden Doors
        ['Fire Rating',   'FD30 / FD60',             ''],
        ['Material',      'Solid Wood',               ''],
        ['Construction',  'TruStile',                 ''],
        ['Joinery',       'Precision Dowel',          ''],
        ['Panel System',  'Floating',                 ''],
        ['Edge',          'Edge-Glued Solid Wood',    ''],
    ],
    5 => [ // Aluminium Doors
        ['Fire Rating',        'FD30 / FD60',          ''],
        ['Material',           'Aluminium',             ''],
        ['Glazing',            '24 / 28 / 36 / 40 / 44 mm', 'mm'],
        ['Profile',            '5-Chamber Sash',        ''],
        ['Life Expectancy',    '40 Years',               'years'],
    ],
    6 => [ // Emergency Exit Doors
        ['Fire Rating',   'FD60 / FD90 / FD120',        ''],
        ['Thickness',     '55 mm (2-hour rated)',        'mm'],
        ['Hardware',      'Panic Bar',                   ''],
        ['Closing',       'Self-Closing Mechanism',      ''],
        ['Compliance',    'International Safety Standards', ''],
    ],
    10 => [ // Smart Locks
        ['Access Methods',   'Fingerprint / PIN / RFID / App', ''],
        ['Auto-Lock',        'Yes',                      ''],
        ['Tamper Alarm',     'Yes',                      ''],
        ['Battery Life',     'Up to 12 Months',          'months'],
        ['Connectivity',     'Bluetooth / WiFi',         ''],
    ],
    15 => [ // MDF Core Panel
        ['Density',          '700–720 kg/m³',            'kg/m³'],
        ['Surface',          'Smooth, Ready-to-finish',  ''],
        ['Moisture Content', '< 10%',                    '%'],
        ['Formaldehyde',     'E1 / E0 Grade',            ''],
        ['Standard',         'EN 622-5',                 ''],
    ],
    16 => [ // MR MDF
        ['Density',          '700–720 kg/m³',            'kg/m³'],
        ['Core Color',       'Green (MR indicator)',     ''],
        ['Moisture Resistance', 'Interior/Humid',        ''],
        ['Standard',         'EN 622-5 MR',              ''],
    ],
    17 => [ // Marine Plywood
        ['Glue Type',        'WBP Phenolic',              ''],
        ['Grade',            'Marine / Construction',     ''],
        ['Veneer',           'B/BB Grade',                ''],
        ['Standard',         'BS 1088',                   ''],
    ],
];

$stmtSpec = $pdo->prepare("INSERT INTO product_specs (product_id, label, value, unit, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?)");
$specCount = 0;
foreach ($specs as $productId => $productSpecs) {
    foreach ($productSpecs as $i => $spec) {
        $stmtSpec->execute([$productId, $spec[0], $spec[1], $spec[2], $i + 1, $now, $now]);
        $specCount++;
    }
}
echo "Product specs inserted: $specCount\n";

// ── BANNERS ───────────────────────────────────────────────────────────────────
$stmtBanner = $pdo->prepare("INSERT INTO banners (image_url, title, subtitle, link_url, is_permanent, is_active, sort_order, created_at, updated_at) VALUES (?,?,?,?,1,1,?,?,?)");
for ($i = 1; $i <= 19; $i++) {
    $stmtBanner->execute(["/uploads/banner-images/{$i}.png", '', '', '', $i, $now, $now]);
}
echo "Banners inserted: 19\n";

// ── CERTIFICATES ──────────────────────────────────────────────────────────────
$certs = [
    ['Fire Door Certificate',          'Fire safety and compliance certification for fire-rated door products.',             '/uploads/certificate-images/1.pdf/1.png',                             1],
    ['Quality Management ISO',         'International quality management system ISO certification.',                          '/uploads/certificate-images/2.pdf/1.png',                             2],
    ['Product Safety Certificate',     'Product safety and regulatory compliance certification.',                             '/uploads/certificate-images/3.pdf/1.png',                             3],
    ['Material Standards',             'Raw material quality and international standards certification.',                     '/uploads/certificate-images/4.pdf/1.png',                             4],
    ['Environmental Certification',    'Environmental compliance and sustainability certification.',                          '/uploads/certificate-images/5.pdf/1.jpeg',                            5],
    ['MSF Certification',              'Full MSF manufacturing standards certification.',                                     '/uploads/certificates/1.png',                                         6],
    ['MDF Technical Datasheet',        'Comprehensive technical datasheet and specifications for MDF door products.',         '/uploads/certificates/TechnicalDatasheetforMDFDoors.pdf/1.png',       7],
];

$stmtCert = $pdo->prepare("INSERT INTO certificates (title, description, image_url, sort_order, is_active, created_at, updated_at) VALUES (?,?,?,?,1,?,?)");
foreach ($certs as $cert) {
    $stmtCert->execute([$cert[0], $cert[1], $cert[2], $cert[3], $now, $now]);
}
echo "Certificates inserted: " . count($certs) . "\n";

// ── PROJECTS ─────────────────────────────────────────────────────────────────
// Projects images 6.png through 44.png (39 total)
$stmtProj = $pdo->prepare("INSERT INTO projects (title, slug, description, image_url, location, year, sort_order, is_active, created_at, updated_at) VALUES (?,?,?,?,?,?,?,1,?,?)");
$projCount = 0;
for ($i = 6; $i <= 44; $i++) {
    $idx = $i - 5;
    $stmtProj->execute([
        "Project " . str_pad((string)$idx, 2, '0', STR_PAD_LEFT),
        "project-" . str_pad((string)$idx, 2, '0', STR_PAD_LEFT),
        "Completed interior and exterior door installation project showcasing Prime Connects quality craftsmanship in the UAE.",
        "/uploads/projects/images/{$i}.png",
        "UAE",
        "2024",
        $idx,
        $now, $now
    ]);
    $projCount++;
}
echo "Projects inserted: $projCount\n";

echo "\n✅ Seeding complete!\n";
