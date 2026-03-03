<?php
/**
 * add_panel_data.php
 * Adds specs and applications (in meta JSON) for all core panel products.
 * Run: php add_panel_data.php  (from backend/ directory)
 */

$host = getenv('DB_HOST') ?: '127.0.0.1';
$db   = getenv('DB_DATABASE') ?: 'primeconnects';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';

// Try to read .env for DB credentials
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile) as $line) {
        $line = trim($line);
        if (!$line || str_starts_with($line, '#')) continue;
        if (preg_match('/^database\.default\.(\w+)\s*=\s*(.*)$/', $line, $m)) {
            $val = trim(trim($m[2]), "'\""); // strip quotes
            match($m[1]) {
                'hostname' => $host = $val,
                'database' => $db   = $val,
                'username' => $user = $val,
                'password' => $pass = $val,
                default    => null,
            };
        }
    }
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("DB connection failed: " . $e->getMessage() . "\n");
}

$now = date('Y-m-d H:i:s');

// ─────────────────────────────────────────────────────────────────────────────
// Panel product data: specs + applications
// ─────────────────────────────────────────────────────────────────────────────
$panelData = [

    'mdf-core-panel' => [
        'specs' => [
            ['Thickness',       '2.5mm, 6mm, 9mm, 12mm, 15mm, 18mm, 25mm',                       null],
            ['Sizes',           '1220×2440mm or as per customer requirements',                     null],
            ['Density',         '650–750 kg/m³',                                                   null],
            ['Moisture',        '<8%',                                                             null],
            ['Surface finish',  'Plain, smooth and sanded',                                        null],
            ['Glue Grade',      'E0, E1, E2',                                                      null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Furniture Manufacturing: Used for making strong, stylish, and durable furniture pieces',
                'Cabinets & Wardrobes: Ideal for modular kitchens and wardrobes with smooth finishes',
                'Partitions & Displays: Strong and decorative option for office and retail partitions',
                'Construction & Flooring: Durable and reusable panels widely used in formwork and flooring',
            ],
            'ar' => [
                'تصنيع الأثاث: يستخدم لصنع قطع أثاث قوية وأنيقة ومتينة',
                'الخزائن والخزائن: مثالي للمطابخ والخزائن المعيارية ذات التشطيبات الناعمة',
                'القواطع والعروض: خيار قوي وزخرفي لقواطع المكاتب والتجزئة',
                'البناء والأرضيات: ألواح متينة وقابلة لإعادة الاستخدام تستخدم على نطاق واسع في القوالب والأرضيات',
            ],
            'zh' => [
                '家具制造：用于制造坚固、时尚且耐用的家具部件',
                '橱柜和衣柜：是具有光滑饰面的模块化厨房和衣柜的理想选择',
                '隔断和展示：办公和零售隔断的坚固且具装饰性的选择',
                '建筑和地板：耐用且可重复使用的面板，广泛用于模板和地板',
            ],
        ],
    ],

    'mr-mdf-core-panel' => [
        'specs' => [
            ['Thickness',       '6mm, 9mm, 12mm, 15mm, 18mm, 25mm',                               null],
            ['Sizes',           '1220×2440mm or as per customer requirements',                     null],
            ['Density',         '700–780 kg/m³',                                                   null],
            ['Moisture',        '<8% (moisture resistant grade)',                                  null],
            ['Surface finish',  'Green-tinted core, smooth sanded',                               null],
            ['Glue Grade',      'E1, E0 (moisture resistant binder)',                             null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Bathrooms & Kitchens: Ideal for humid environments where standard MDF would swell',
                'Laundry Rooms: Maintains structural integrity in areas exposed to moisture',
                'Commercial Spaces: Used in restaurants, hospitals, and hotels with humidity concerns',
                'Exterior Cladding: Suitable for semi-exposed applications with protective coating',
            ],
            'ar' => [
                'الحمامات والمطابخ: مثالي للبيئات الرطبة حيث ينتفخ MDF القياسي',
                'غرف الغسيل: يحافظ على السلامة الهيكلية في المناطق المعرضة للرطوبة',
                'المساحات التجارية: يستخدم في المطاعم والمستشفيات والفنادق ذات مشكلات الرطوبة',
                'الكسوة الخارجية: مناسب للتطبيقات شبه المكشوفة مع الطلاء الواقي',
            ],
            'zh' => [
                '浴室和厨房：适用于标准MDF会膨胀的潮湿环境',
                '洗衣房：在潮湿区域保持结构完整性',
                '商业空间：用于有湿度问题的餐厅、医院和酒店',
                '外墙覆层：适用于有保护涂层的半暴露应用',
            ],
        ],
    ],

    'core-panel-plywood' => [
        'specs' => [
            ['Thickness',       '2.5mm to 25mm',                                                   null],
            ['Sizes',           '1220×2440mm or as per customer requirements',                     null],
            ['Glue',            'E0, E1, E2 bonding systems',                                      null],
            ['Density',         'Wood fiber core from poplar, pine, or hardwood combinations',     null],
            ['Moisture',        'Standard indoor moisture resistance',                             null],
            ['Surface finish',  'Plain, melamine (matt, textured, high-gloss, embossed)',          null],
            ['Material',        'Poplar, pine or hardwood combination core',                       null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Boat Building: Used in boat building for its water resistance and durability',
                'Construction & Formwork: Used for formwork, flooring, and scaffolding due to its strength and stability',
                'Partitions & Paneling: Provides stable and aesthetic solutions for interior partitions and wall paneling',
                'Wall Cladding & Ceilings: Enhances interiors with decorative and protective wooden finishes',
            ],
            'ar' => [
                'بناء القوارب: يستخدم في بناء القوارب لمقاومته للماء ومتانته',
                'البناء والقوالب: يستخدم للقوالب والأرضيات والسقالات بسبب قوته واستقراره',
                'القواطع والألواح: يوفر حلولاً مستقرة وجمالية للقواطع الداخلية وألواح الجدران',
                'كسوة الجدران والأسقف: يعزز الديكورات الداخلية بتشطيبات خشبية زخرفية وواقية',
            ],
            'zh' => [
                '船舶制造：用于船舶建造，具有防水性和耐用性',
                '建筑和模板：由于其强度和稳定性，用于模板、地板和脚手架',
                '隔断和墙板：为室内隔断和墙板提供稳定和美观的解决方案',
                '墙体覆层和天花板：用装饰性和保护性木饰面增强室内效果',
            ],
        ],
    ],

    'film-faced-mdf-panels' => [
        'specs' => [
            ['Thickness',       '1–25mm or customized as per client requirements',                 null],
            ['Sizes',           '1220×2440mm, 1535×2440mm, 1830×2440mm or as required',           null],
            ['Glue Grade',      'E2, E1, E0, CARB',                                               null],
            ['Density',         '680–1000 kg/m³',                                                  null],
            ['Moisture',        '4–12%',                                                           null],
            ['Surface finish',  'Phenolic film coating (smooth, one or both faces)',              null],
            ['Material',        'Poplar, Pine and hardwood combination',                          null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Shelving & Racks: Strong and stylish option for storage shelves in homes or shops',
                'Doors & Panels: Provides smooth and durable surface for interior doors',
                'Hotel & Restaurant Interiors: Adds warmth and elegance to hospitality spaces',
                'False Ceilings: Enhances interiors with decorative wooden ceiling panels',
            ],
            'ar' => [
                'الأرفف والرفوف: خيار قوي وأنيق لرفوف التخزين في المنازل أو المحلات',
                'الأبواب والألواح: توفر سطحاً ناعماً ومتيناً للأبواب الداخلية',
                'ديكورات الفنادق والمطاعم: يضيف الدفء والأناقة لمساحات الضيافة',
                'الأسقف المستعارة: يعزز الديكورات الداخلية بألواح السقف الخشبية الزخرفية',
            ],
            'zh' => [
                '货架和架子：家庭或商店存储货架的坚固且时尚的选择',
                '门和面板：为室内门提供光滑耐用的表面',
                '酒店和餐厅内饰：为接待空间增添温暖和优雅',
                '吊顶：用装饰木制天花板增强室内效果',
            ],
        ],
    ],

    'melamine-faced-mdf-panels' => [
        'specs' => [
            ['Thickness',       '2.5mm to 25mm (common: 9mm, 12mm, 15mm, 17mm, 18mm)',           null],
            ['Glue Grade',      'E0, E1, E2 bonding systems',                                     null],
            ['Density',         'Wood fiber core: poplar, pine, hardwood, or combinations',       null],
            ['Moisture',        'Standard indoor moisture resistance',                            null],
            ['Surface finish',  'Melamine (matt, textured, high-gloss, embossed)',                null],
            ['Color options',   'Solid colors, wood grain, fancy, stone colors, or customized',   null],
            ['Material',        'Poplar, pine or hardwood combination',                           null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                              null],
        ],
        'applications' => [
            'en' => [
                'Shelving & Racks: Strong and stylish option for storage shelves in homes or shops',
                'Doors & Panels: Provides smooth and durable surface for interior doors',
                'Hotel & Restaurant Interiors: Adds warmth and elegance to hospitality spaces',
                'False Ceilings: Enhances interiors with decorative wooden ceiling panels',
            ],
            'ar' => [
                'الأرفف والرفوف: خيار قوي وأنيق لرفوف التخزين في المنازل أو المحلات',
                'الأبواب والألواح: توفر سطحاً ناعماً ومتيناً للأبواب الداخلية',
                'ديكورات الفنادق والمطاعم: يضيف الدفء والأناقة لمساحات الضيافة',
                'الأسقف المستعارة: يعزز الديكورات الداخلية بألواح السقف الخشبية الزخرفية',
            ],
            'zh' => [
                '货架和架子：家庭或商店存储货架的坚固且时尚的选择',
                '门和面板：为室内门提供光滑耐用的表面',
                '酒店和餐厅内饰：为接待空间增添温暖和优雅',
                '吊顶：用装饰木制天花板增强室内效果',
            ],
        ],
    ],

    'film-faced-plywood' => [
        'specs' => [
            ['Thickness',       '1–25mm or customized as per client requirements',                 null],
            ['Sizes',           '1220×2440mm, 1535×2440mm, 1830×2440mm or as required',          null],
            ['Glue Grade',      'E2, E1, E0, CARB (WBP phenolic)',                                null],
            ['Density',         '680–1000 kg/m³',                                                  null],
            ['Moisture',        '4–12%',                                                           null],
            ['Surface finish',  'Phenolic film (brown tropical / black Nordic grade)',            null],
            ['Material',        'Poplar, Pine and hardwood combination',                          null],
            ['Film faces',      'Both faces coated for maximum protection',                       null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Furniture Manufacturing: Used for making strong, stylish, and durable furniture pieces',
                'Cabinets & Wardrobes: Ideal for modular kitchens and wardrobes with smooth finishes',
                'Partitions & Displays: Strong and decorative option for office and retail partitions',
                'Construction & Flooring: Durable and reusable panels widely used in formwork and flooring',
            ],
            'ar' => [
                'تصنيع الأثاث: يستخدم لصنع قطع أثاث قوية وأنيقة ومتينة',
                'الخزائن والخزائن: مثالي للمطابخ والخزائن المعيارية ذات التشطيبات الناعمة',
                'القواطع والعروض: خيار قوي وزخرفي لقواطع المكاتب والتجزئة',
                'البناء والأرضيات: ألواح متينة وقابلة لإعادة الاستخدام تستخدم على نطاق واسع في القوالب والأرضيات',
            ],
            'zh' => [
                '家具制造：用于制造坚固、时尚且耐用的家具部件',
                '橱柜和衣柜：是具有光滑饰面的模块化厨房和衣柜的理想选择',
                '隔断和展示：办公和零售隔断的坚固且具装饰性的选择',
                '建筑和地板：耐用且可重复使用的面板，广泛用于模板和地板',
            ],
        ],
    ],

    'melamine-faced-plywood' => [
        'specs' => [
            ['Thickness',       '6mm–25mm',                                                        null],
            ['Sizes',           '1220×2440×18mm, 1220×2440×15mm or as per requirements',         null],
            ['Glue Grade',      'E0, E1, E2, MR',                                                 null],
            ['Density',         '680–780 kg/m³',                                                   null],
            ['Moisture',        '8–20%',                                                           null],
            ['Surface finish',  'Melamine Paper',                                                  null],
            ['Color options',   'Solid (white, black, blue etc.), wood grain, cloth grain',       null],
            ['Material',        'Wood chips: Poplar, Pine, Combi, etc.',                          null],
            ['Certifications',  'CARB, CE, ISO9001:2000, ISO14001',                               null],
        ],
        'applications' => [
            'en' => [
                'Furniture Manufacturing: Used for making strong, stylish, and durable furniture pieces',
                'Cabinets & Wardrobes: Ideal for modular kitchens and wardrobes with smooth finishes',
                'Partitions & Displays: Strong and decorative option for office and retail partitions',
                'Construction & Flooring: Durable and reusable panels widely used in formwork and flooring',
            ],
            'ar' => [
                'تصنيع الأثاث: يستخدم لصنع قطع أثاث قوية وأنيقة ومتينة',
                'الخزائن والخزائن: مثالي للمطابخ والخزائن المعيارية ذات التشطيبات الناعمة',
                'القواطع والعروض: خيار قوي وزخرفي لقواطع المكاتب والتجزئة',
                'البناء والأرضيات: ألواح متينة وقابلة لإعادة الاستخدام تستخدم على نطاق واسع في القوالب والأرضيات',
            ],
            'zh' => [
                '家具制造：用于制造坚固、时尚且耐用的家具部件',
                '橱柜和衣柜：是具有光滑饰面的模块化厨房和衣柜的理想选择',
                '隔断和展示：办公和零售隔断的坚固且具装饰性的选择',
                '建筑和地板：耐用且可重复使用的面板，广泛用于模板和地板',
            ],
        ],
    ],

    'marine-construction-plywood' => [
        'specs' => [
            ['Thickness',       '4mm, 6mm, 9mm, 12mm, 15mm, 18mm, 21mm, 25mm',                   null],
            ['Sizes',           '1220×2440mm or as per customer requirements',                    null],
            ['Glue Grade',      'WBP (Weather and Boil Proof), E0, E1',                          null],
            ['Density',         '550–700 kg/m³',                                                   null],
            ['Moisture',        '6–14%',                                                           null],
            ['Surface finish',  'Smooth sanded both faces, BB/BB or BB/CC grade',                null],
            ['Material',        'Okoume, Meranti, Poplar or Hardwood face veneers',               null],
            ['Certifications',  'BS 1088 Marine, CE, ISO9001:2000, Lloyd Register',               null],
        ],
        'applications' => [
            'en' => [
                'Marine Construction: Used in boat hulls, decks, and marine interiors for superior waterproofing',
                'Building Formwork: Ideal for concrete shuttering due to its strength and water resistance',
                'Flooring Systems: Suitable for flooring in both residential and commercial buildings',
                'Structural Paneling: Provides structural support in walls, roofs, and general construction',
            ],
            'ar' => [
                'البناء البحري: يستخدم في أجسام القوارب والأسطح والمناطق الداخلية البحرية للعزل المائي المتفوق',
                'قوالب صب الخرسانة: مثالي للقوالب الخرسانية بسبب قوته ومقاومته للماء',
                'أنظمة الأرضيات: مناسب للأرضيات في المباني السكنية والتجارية',
                'الألواح الهيكلية: يوفر دعماً هيكلياً في الجدران والأسقف والبناء العام',
            ],
            'zh' => [
                '船舶建造：用于船体、甲板和船舶内饰，具有卓越的防水性能',
                '建筑模板：由于其强度和防水性，非常适合混凝土模板',
                '地板系统：适用于住宅和商业建筑的地板',
                '结构板：在墙体、屋顶和一般建筑中提供结构支撑',
            ],
        ],
    ],

    'solid-chip-board' => [
        'specs' => [
            ['Thickness',       '8mm, 12mm, 15mm, 16mm, 18mm, 22mm, 25mm',                        null],
            ['Sizes',           '1220×2440mm or custom sizes',                                    null],
            ['Density',         '620–680 kg/m³',                                                   null],
            ['Moisture',        '<12%',                                                            null],
            ['Surface finish',  'Raw, melamine-faced, or lacquered options',                      null],
            ['Glue Grade',      'E1, E2',                                                          null],
            ['Material',        'Wood chips and particles bonded with synthetic resin',            null],
            ['Certifications',  'CE, ISO9001:2000, ISO14001',                                     null],
        ],
        'applications' => [
            'en' => [
                'Furniture Carcasses: Economical and stable base material for wardrobe, cabinet, and desk frames',
                'Flooring Underlay: Used as a sub-floor layer for laminate and vinyl flooring systems',
                'Shelving: Cost-effective shelving boards for retail fixtures, storage units, and libraries',
                'Interior Partitions: Lightweight and rigid solution for non-load-bearing interior walls',
            ],
            'ar' => [
                'هياكل الأثاث: مادة أساسية اقتصادية ومستقرة لإطارات الخزائن والرفوف والمكاتب',
                'طبقة تحت الأرضية: يستخدم كطبقة أرضية فرعية لأنظمة أرضيات الرقائق والفينيل',
                'الأرفف: ألواح رفوف فعالة من حيث التكلفة للتركيبات التجزئة ووحدات التخزين والمكتبات',
                'القواطع الداخلية: حل خفيف الوزن وصلب للجدران الداخلية غير الحاملة',
            ],
            'zh' => [
                '家具框架：衣柜、橱柜和桌子框架的经济稳定基础材料',
                '地板衬垫：用作层压板和乙烯基地板系统的地板底层',
                '货架：用于零售装置、储藏单元和图书馆的经济实惠货架板',
                '室内隔断：非承重室内墙的轻质且坚硬的解决方案',
            ],
        ],
    ],
];

// ─────────────────────────────────────────────────────────────────────────────
// Process each product
// ─────────────────────────────────────────────────────────────────────────────
$totalSpecsAdded = 0;
$totalProductsUpdated = 0;

foreach ($panelData as $slug => $data) {
    // Find product by slug
    $stmt = $pdo->prepare("SELECT id FROM products WHERE slug = ? AND deleted_at IS NULL");
    $stmt->execute([$slug]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo "⚠  Product not found: $slug\n";
        continue;
    }

    $productId = $product['id'];

    // Remove existing specs for this product (to avoid duplicates on re-run)
    $pdo->prepare("DELETE FROM product_specs WHERE product_id = ?")->execute([$productId]);

    // Insert specs
    $specsInsert = $pdo->prepare("
        INSERT INTO product_specs (product_id, label, value, unit, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    foreach ($data['specs'] as $i => [$label, $value, $unit]) {
        $specsInsert->execute([$productId, $label, $value, $unit, $i + 1, $now, $now]);
        $totalSpecsAdded++;
    }

    // Update meta with applications
    $meta = json_encode(['applications' => $data['applications']], JSON_UNESCAPED_UNICODE);
    $pdo->prepare("UPDATE products SET meta = ?, updated_at = ? WHERE id = ?")
        ->execute([$meta, $now, $productId]);

    echo "✓  $slug (id=$productId): " . count($data['specs']) . " specs + applications saved\n";
    $totalProductsUpdated++;
}

echo "\n✅  Done. Updated $totalProductsUpdated products, added $totalSpecsAdded specs.\n";
