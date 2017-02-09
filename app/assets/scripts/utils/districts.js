'use strict';

const districts = [
  {
    id: `0101`,
    name: `Al Tbeen`,
    nameAr: `التبين`
  },
  {
    id: `0102`,
    name: `Helwan`,
    nameAr: `حلوان`
  },
  {
    id: `0103`,
    name: `15th of May`,
    nameAr: `مدينة ١٥ مايو`
  },
  {
    id: `0104`,
    name: `Maadi`,
    nameAr: `المعادي`
  },
  {
    id: `0105`,
    name: `Al Mosky`,
    nameAr: `الموسكي`
  },
  {
    id: `0106`,
    name: `Misr Al Kadima`,
    nameAr: `مصر القديمة`
  },
  {
    id: `0107`,
    name: `Al Sayda Zeinab`,
    nameAr: `السيدة زينب`
  },
  {
    id: `0108`,
    name: `Al Khalifa`,
    nameAr: `الخليفة`
  },
  {
    id: `0109`,
    name: `Abdeen`,
    nameAr: `عبدين`
  },
  {
    id: `0111`,
    name: `Kasr  El  Nile`,
    nameAr: `قصر النيل`
  },
  {
    id: `0112`,
    name: `Bolak`,
    nameAr: `بولاق`
  },
  {
    id: `0113`,
    name: `El  Azbakia`,
    nameAr: `الأزبكية`
  },
  {
    id: `0114`,
    name: `Al Darb  El Ahmr`,
    nameAr: `الدرب الأحمر`
  },
  {
    id: `0116`,
    name: `Bab Al Sharia`,
    nameAr: `باب الشعرية`
  },
  {
    id: `0117`,
    name: `Al Zaher`,
    nameAr: `الظاهر`
  },
  {
    id: `0118`,
    name: `El Sharabia`,
    nameAr: `الشرابية`
  },
  {
    id: `0119`,
    name: `Shobra`,
    nameAr: `شبرا`
  },
  {
    id: `0120`,
    name: `Rod El Farg`,
    nameAr: `روض الفرج`
  },
  {
    id: `0121`,
    name: `Al Sahel`,
    nameAr: `الساحل`
  },
  {
    id: `0122`,
    name: `Al Waily`,
    nameAr: `الوايلي`
  },
  {
    id: `0123`,
    name: `Hadaek Al Koba`,
    nameAr: `حدائق القبة`
  },
  {
    id: `0124`,
    name: `Al Zayton`,
    nameAr: `الزيتون`
  },
  {
    id: `0125`,
    name: `Al Mataria`,
    nameAr: `المطرية`
  },
  {
    id: `0126`,
    name: `First Nasr City`,
    nameAr: `مدينة نصر أول`
  },
  {
    id: `0127`,
    name: `Nasr City`,
    nameAr: `مدينة نصر`
  },
  {
    id: `0128`,
    name: `Misr Al Gadidah`,
    nameAr: `مصر الجديدة`
  },
  {
    id: `0129`,
    name: `Al Nozha`,
    nameAr: `النزهة`
  },
  {
    id: `0130`,
    name: `Ain Shams`,
    nameAr: `عين شمس`
  },
  {
    id: `0131`,
    name: `Al Zawya Al Hamraa`,
    nameAr: `الزاوية الحمراء`
  },
  {
    id: `0132`,
    name: `Al Salam`,
    nameAr: `السلام`
  },
  {
    id: `0133`,
    name: `Zamalek`,
    nameAr: `الزمالك`
  },
  {
    id: `0134`,
    name: `Monsha'at Nasser`,
    nameAr: `منشأة ناصر`
  },
  {
    id: `0135`,
    name: `Al Basatin`,
    nameAr: `البساتين`
  },
  {
    id: `0136`,
    name: `Al Marg`,
    nameAr: `المرج`
  },
  {
    id: `0137`,
    name: `New Cairo`,
    nameAr: `القاهرة الجديدة`
  },
  {
    id: `0140`,
    name: `Al Shrook`,
    nameAr: `الشروق`
  },
  {
    id: `0201`,
    name: `Al Montzh First`,
    nameAr: `المنتزه أول`
  },
  {
    id: `0202`,
    name: `Al Raml`,
    nameAr: `الرمل`
  },
  {
    id: `0203`,
    name: `Seedy Gaber`,
    nameAr: `سيدي جابر`
  },
  {
    id: `0204`,
    name: `Bab Sharki`,
    nameAr: `باب شرق`
  },
  {
    id: `0205`,
    name: `Moharm Bek`,
    nameAr: `محرم بك`
  },
  {
    id: `0206`,
    name: `Al Atarin`,
    nameAr: `العطارين`
  },
  {
    id: `0207`,
    name: `Al Manshia`,
    nameAr: `المنشية`
  },
  {
    id: `0208`,
    name: `Karmoz`,
    nameAr: `كرموز`
  },
  {
    id: `0209`,
    name: `Al Lban`,
    nameAr: `اللبان`
  },
  {
    id: `0210`,
    name: `Al Gomrok`,
    nameAr: `الجمرك`
  },
  {
    id: `0211`,
    name: `Mina Al Bassl`,
    nameAr: `مينا البصل`
  },
  {
    id: `0212`,
    name: `Al Dkhela`,
    nameAr: `الداخلة`
  },
  {
    id: `0213`,
    name: `Al Amaria`,
    nameAr: `العامرية`
  },
  {
    id: `0214`,
    name: `Borg Al Arab`,
    nameAr: `برج العرب`
  },
  {
    id: `0215`,
    name: `Alexandria Harbour`,
    nameAr: `مياء الاسكندرية`
  },
  {
    id: `0216`,
    name: `New Borg Al Arab City`,
    nameAr: `مدينة برج العرب الجديدة`
  },
  {
    id: `0301`,
    name: `Al Shark`,
    nameAr: `شرق`
  },
  {
    id: `0302`,
    name: `Al Arab`,
    nameAr: `العرب`
  },
  {
    id: `0303`,
    name: `Al Manakh`,
    nameAr: `المناخ`
  },
  {
    id: `0305`,
    name: `Al Dawahy`,
    nameAr: `الضواحي`
  },
  {
    id: `0306`,
    name: `Al Ganob`,
    nameAr: `جنوب`
  },
  {
    id: `0307`,
    name: `Al Zohor`,
    nameAr: `الزهور`
  },
  {
    id: `0308`,
    name: `Port Foa'ad`,
    nameAr: `بورفؤاد`
  },
  {
    id: `0309`,
    name: `Mubark  - East Of Al Tafreah`,
    nameAr: `مبارك – شرق التفريعة`
  },
  {
    id: `0310`,
    name: `Al Manasra`,
    nameAr: `المناصرة`
  },
  {
    id: `0312`,
    name: `Port Saed Harbour Department`,
    nameAr: `مديرية ميناء بورسعيد`
  },
  {
    id: `0401`,
    name: `Suez`,
    nameAr: `السويس`
  },
  {
    id: `0402`,
    name: `Al Arbaeen`,
    nameAr: `الأربعين`
  },
  {
    id: `0403`,
    name: `Ataka`,
    nameAr: `العتاقة`
  },
  {
    id: `0404`,
    name: `Faisal`,
    nameAr: `فيصل`
  },
  {
    id: `0405`,
    name: `Al Ganain`,
    nameAr: `الجناين`
  },
  {
    id: `0406`,
    name: `Suez Harbour Department`,
    nameAr: `مديرية ميناء السويس`
  },
  {
    id: `1102`,
    name: `Damietta`,
    nameAr: `دمياط`
  },
  {
    id: `1103`,
    name: `Farskor`,
    nameAr: `فارسكور`
  },
  {
    id: `1104`,
    name: `Kafr Sa'ad`,
    nameAr: `كفر سعد`
  },
  {
    id: `1105`,
    name: `New Damietta City`,
    nameAr: `مدينة دمياط الجديدة`
  },
  {
    id: `1106`,
    name: `Ras Al Bar`,
    nameAr: `رأس البر`
  },
  {
    id: `1107`,
    name: `Al Zarka`,
    nameAr: `الزرقا دمياط`
  },
  {
    id: `1108`,
    name: `New Damietta Harbour Department`,
    nameAr: `مديرية ميناء دمياط الجديد`
  },
  {
    id: `1201`,
    name: `Mansoura`,
    nameAr: `المنصورة`
  },
  {
    id: `1204`,
    name: `Aga`,
    nameAr: `أجا`
  },
  {
    id: `1205`,
    name: `Al Senbilawin`,
    nameAr: `السنبلاوين`
  },
  {
    id: `1206`,
    name: `Al Mattaria`,
    nameAr: `المطرية`
  },
  {
    id: `1207`,
    name: `Al Manzala`,
    nameAr: `المنزلة`
  },
  {
    id: `1208`,
    name: `Bilkas`,
    nameAr: `بلقيس`
  },
  {
    id: `1209`,
    name: `Dekrnes`,
    nameAr: `دكرنس`
  },
  {
    id: `1210`,
    name: `Sherbin`,
    nameAr: `شربين`
  },
  {
    id: `1211`,
    name: `Talkha`,
    nameAr: `طلخا`
  },
  {
    id: `1212`,
    name: `Meet Gamr`,
    nameAr: `ميت غمر`
  },
  {
    id: `1214`,
    name: `Menit Al Nasr`,
    nameAr: `منية النصر`
  },
  {
    id: `1215`,
    name: `Al Gamalia`,
    nameAr: `الجمالية`
  },
  {
    id: `1215`,
    name: `Al Gamalia`,
    nameAr: `الجمالية`
  },
  {
    id: `1216`,
    name: `Tamy Al Madid`,
    nameAr: `تمى الأمديد`
  },
  {
    id: `1217`,
    name: `Meet Selsabil`,
    nameAr: `ميت سلسيل`
  },
  {
    id: `1218`,
    name: `Bani Ebeed`,
    nameAr: `بني عبيد`
  },
  {
    id: `1219`,
    name: `Mahlat Damna`,
    nameAr: `محلة دمنة`
  },
  {
    id: `1220`,
    name: `Gamasa`,
    nameAr: `جمصة`
  },
  {
    id: `1221`,
    name: `Nabroh`,
    nameAr: `نبروه الدقهلية`
  },
  {
    id: `1301`,
    name: `Zakazik`,
    nameAr: `الزقازيق`
  },
  {
    id: `1303`,
    name: `Al Zakazik`,
    nameAr: `الزقازيق`
  },
  {
    id: `1304`,
    name: `Abo Hamad`,
    nameAr: `أبو حماد`
  },
  {
    id: `1305`,
    name: `Abo Kbeer`,
    nameAr: `أبو كبير`
  },
  {
    id: `1306`,
    name: `Al Hesinia`,
    nameAr: `الحسينية`
  },
  {
    id: `1307`,
    name: `New Salhia`,
    nameAr: `الصالحية الجديدة`
  },
  {
    id: `1308`,
    name: `Belbes`,
    nameAr: `بلبيس`
  },
  {
    id: `1309`,
    name: `10th of Ramadan`,
    nameAr: `العاشر من رمضان`
  },
  {
    id: `1310`,
    name: `Derb Nagm`,
    nameAr: `درب نجم`
  },
  {
    id: `1311`,
    name: `Fakous`,
    nameAr: `فاقوس`
  },
  {
    id: `1313`,
    name: `Kafr Sakr`,
    nameAr: `كفر صقر`
  },
  {
    id: `1314`,
    name: `Menia Al Kamh`,
    nameAr: `منيا القمح`
  },
  {
    id: `1315`,
    name: `Hahia`,
    nameAr: `ههيا`
  },
  {
    id: `1316`,
    name: `Mashtol Al Sook`,
    nameAr: `مشتول السوق`
  },
  {
    id: `1317`,
    name: `Al Ebrahimia`,
    nameAr: `الإبراهيمية`
  },
  {
    id: `1318`,
    name: `Al Kenaiat`,
    nameAr: `القنايات`
  },
  {
    id: `1319`,
    name: `Awlad Sakr`,
    nameAr: `أولاد صقر`
  },
  {
    id: `1320`,
    name: `Al Karin`,
    nameAr: `القرين`
  },
  {
    id: `1401`,
    name: `Banha`,
    nameAr: `بنها`
  },
  {
    id: `1403`,
    name: `Al Khanka`,
    nameAr: `الخانكة`
  },
  {
    id: `1404`,
    name: `Al Knater Al Khiria`,
    nameAr: `القناطر الخيرية`
  },
  {
    id: `1405`,
    name: `Shbin Al Knanater`,
    nameAr: `شبين القناطر`
  },
  {
    id: `1406`,
    name: `Shobra Al Khima`,
    nameAr: `شبرا الخيمة`
  },
  {
    id: `1408`,
    name: `Tokh`,
    nameAr: `طوخ`
  },
  {
    id: `1409`,
    name: `Kaliob`,
    nameAr: `قليوب`
  },
  {
    id: `1411`,
    name: `Kafr Shokr`,
    nameAr: `كفر شكر`
  },
  {
    id: `1412`,
    name: `Al Khosos`,
    nameAr: `الخصوص`
  },
  {
    id: `1413`,
    name: `Al Oboor`,
    nameAr: `العبور`
  },
  {
    id: `1414`,
    name: `Khaha`,
    nameAr: `قها`
  },
  {
    id: `1501`,
    name: `Kafr Al Shikh`,
    nameAr: `كفر الشيخ`
  },
  {
    id: `1503`,
    name: `Al Brolos`,
    nameAr: `البرلس`
  },
  {
    id: `1504`,
    name: `Beala`,
    nameAr: `بيلا`
  },
  {
    id: `1505`,
    name: `Desok`,
    nameAr: `دسوق`
  },
  {
    id: `1507`,
    name: `Sedi Salem`,
    nameAr: `سيدي سالم`
  },
  {
    id: `1508`,
    name: `Fowa`,
    nameAr: `فوه`
  },
  {
    id: `1509`,
    name: `Kelin`,
    nameAr: `قلين`
  },
  {
    id: `1510`,
    name: `Motobs`,
    nameAr: `موتوباس`
  },
  {
    id: `1511`,
    name: `Al Hamol`,
    nameAr: `الحمول`
  },
  {
    id: `1512`,
    name: `Al Reyad`,
    nameAr: `الرياض`
  },
  {
    id: `1601`,
    name: `Tanta`,
    nameAr: `طنطا`
  },
  {
    id: `1604`,
    name: `Al Santa`,
    nameAr: `السنطة`
  },
  {
    id: `1605`,
    name: `Al Mahala Al Kobra`,
    nameAr: `المحلة الكبرى`
  },
  {
    id: `1606`,
    name: `El Mahala  El  Kobra`,
    nameAr: `المحلة الكبرى`
  },
  {
    id: `1607`,
    name: `Al Mehala Al Kobra`,
    nameAr: `المحلة الكبرى`
  },
  {
    id: `1608`,
    name: `Basyon`,
    nameAr: `بسيون`
  },
  {
    id: `1609`,
    name: `Zefta`,
    nameAr: `زفتى`
  },
  {
    id: `1610`,
    name: `Samanod`,
    nameAr: `سمنود`
  },
  {
    id: `1611`,
    name: `Kator`,
    nameAr: `قطور`
  },
  {
    id: `1612`,
    name: `Kafr Al Ziat`,
    nameAr: `كفر الزيات`
  },
  {
    id: `1701`,
    name: `Shbin  Al Kom`,
    nameAr: `شبين الكوم`
  },
  {
    id: `1702`,
    name: `Shbin Al Kom`,
    nameAr: `شبين الكوم`
  },
  {
    id: `1703`,
    name: `Ashmon`,
    nameAr: `أشمون`
  },
  {
    id: `1704`,
    name: `Al Bagor`,
    nameAr: `البجور`
  },
  {
    id: `1705`,
    name: `Al Shohda'a`,
    nameAr: `الشهداء`
  },
  {
    id: `1706`,
    name: `Berkt Al Sabh`,
    nameAr: `بركة السبع`
  },
  {
    id: `1707`,
    name: `Tala`,
    nameAr: `تلا`
  },
  {
    id: `1708`,
    name: `Kewsina`,
    nameAr: `قويسنا`
  },
  {
    id: `1710`,
    name: `Sers Elliana`,
    nameAr: `سرس الليان`
  },
  {
    id: `1711`,
    name: `Elsadat City`,
    nameAr: `مدينة السادات`
  },
  {
    id: `1712`,
    name: `Monof`,
    nameAr: `منوف`
  },
  {
    id: `1802`,
    name: `Damnhor`,
    nameAr: `دمنهور`
  },
  {
    id: `1803`,
    name: `Abo Al Matamir`,
    nameAr: `أبو المطامير`
  },
  {
    id: `1804`,
    name: `Abo Homs`,
    nameAr: `أبو  حمص`
  },
  {
    id: `1805`,
    name: `Al Delngat`,
    nameAr: `الدلنجات`
  },
  {
    id: `1806`,
    name: `Al Mahmodia`,
    nameAr: `المحمودية`
  },
  {
    id: `1807`,
    name: `Etay Al Barod`,
    nameAr: `إيتاي البارود`
  },
  {
    id: `1808`,
    name: `Hosh Eisa`,
    nameAr: `حوش عيسى`
  },
  {
    id: `1809`,
    name: `Rashid`,
    nameAr: `رشيد`
  },
  {
    id: `1810`,
    name: `Shobra Kheet`,
    nameAr: `شبراخيت`
  },
  {
    id: `1811`,
    name: `Kafr Al Dwar`,
    nameAr: `كفر الدوار`
  },
  {
    id: `1813`,
    name: `Koom Hamada`,
    nameAr: `كوم حماده`
  },
  {
    id: `1814`,
    name: `Al Natron Valley`,
    nameAr: `وادي النطرون`
  },
  {
    id: `1815`,
    name: `Al Rahmania`,
    nameAr: `الرحمانية`
  },
  {
    id: `1816`,
    name: `Edko`,
    nameAr: `إدكو`
  },
  {
    id: `1817`,
    name: `West Of Nobaria`,
    nameAr: `غرب النوبارية`
  },
  {
    id: `1818`,
    name: `Badr`,
    nameAr: `بدر`
  },
  {
    id: `1818`,
    name: `Badr`,
    nameAr: `بدر`
  },
  {
    id: `1901`,
    name: `Ismailia`,
    nameAr: `الإسماعيلية`
  },
  {
    id: `1905`,
    name: `Al Tal Elkebeer`,
    nameAr: `التل الكبير`
  },
  {
    id: `1906`,
    name: `Al Kantara`,
    nameAr: `القنطرة`
  },
  {
    id: `1907`,
    name: `Fayed`,
    nameAr: `فايد`
  },
  {
    id: `1908`,
    name: `East Kantra`,
    nameAr: `قنطرة شرق`
  },
  {
    id: `2101`,
    name: `Imbaba`,
    nameAr: `إمبابة`
  },
  {
    id: `2102`,
    name: `Al Agoza`,
    nameAr: `العجوزة`
  },
  {
    id: `2103`,
    name: `Al Doki`,
    nameAr: `الدقي`
  },
  {
    id: `2104`,
    name: `Giza`,
    nameAr: `الجيزة`
  },
  {
    id: `2105`,
    name: `Bulaq Al Dakrur`,
    nameAr: `بولاق الدكرور`
  },
  {
    id: `2106`,
    name: `Pyramids`,
    nameAr: `الهرم`
  },
  {
    id: `2107`,
    name: `6th of October City`,
    nameAr: `مدينة السادس من أكتوبر`
  },
  {
    id: `2108`,
    name: `Al Hawamdiyya`,
    nameAr: `الحوامدية`
  },
  {
    id: `2109`,
    name: `Al Giza`,
    nameAr: `الجيزة`
  },
  {
    id: `2110`,
    name: `Al Badrashin`,
    nameAr: `البدرشين`
  },
  {
    id: `2111`,
    name: `Al Saf`,
    nameAr: `الصف`
  },
  {
    id: `2112`,
    name: `Al Ayyat`,
    nameAr: `العياط`
  },
  {
    id: `2114`,
    name: `Al Wahat Baharya`,
    nameAr: `الواحات البحرية`
  },
  {
    id: `2115`,
    name: `Atfîh`,
    nameAr: `أطفيح`
  },
  {
    id: `2116`,
    name: `Usim`,
    nameAr: `أوسيم`
  },
  {
    id: `2117`,
    name: `Al Warraq`,
    nameAr: `الوراق`
  },
  {
    id: `2118`,
    name: `Al Umraniyya`,
    nameAr: `العمرانية`
  },
  {
    id: `2119`,
    name: `Al Shikh Zaied`,
    nameAr: `الشيخ زايد`
  },
  {
    id: `2120`,
    name: `Kirdasa`,
    nameAr: `كرداسة`
  },
  {
    id: `2202`,
    name: `Beni Suef`,
    nameAr: `بني سويف`
  },
  {
    id: `2203`,
    name: `New Beni Suef`,
    nameAr: `مدينة بني سويف الجديدة`
  },
  {
    id: `2204`,
    name: `Al Fishn`,
    nameAr: `الفشن`
  },
  {
    id: `2205`,
    name: `Al Wasty`,
    nameAr: `الواسطى`
  },
  {
    id: `2206`,
    name: `Ahnasia`,
    nameAr: `أهناسيا`
  },
  {
    id: `2207`,
    name: `Beba`,
    nameAr: `ببا`
  },
  {
    id: `2208`,
    name: `Smsta`,
    nameAr: `سمطا`
  },
  {
    id: `2209`,
    name: `Naser`,
    nameAr: `ناصر`
  },
  {
    id: `2302`,
    name: `Al Fayyum`,
    nameAr: `الفيوم`
  },
  {
    id: `2303`,
    name: `Abshway`,
    nameAr: `إبشواي`
  },
  {
    id: `2304`,
    name: `Itsa`,
    nameAr: `إطسا`
  },
  {
    id: `2305`,
    name: `Snors`,
    nameAr: `سنورس`
  },
  {
    id: `2306`,
    name: `Tamia`,
    nameAr: `طامية`
  },
  {
    id: `2307`,
    name: `Youssif Al Sedik`,
    nameAr: `يوسف الصديق`
  },
  {
    id: `2308`,
    name: `New Fayoum City`,
    nameAr: `مدينة الفيوم الجديدة`
  },
  {
    id: `2402`,
    name: `Al Menia`,
    nameAr: `المنيا`
  },
  {
    id: `2403`,
    name: `New Menia City`,
    nameAr: `مدينة المنيا الجديدة`
  },
  {
    id: `2404`,
    name: `Abo Korkas`,
    nameAr: `أبو قرقاص`
  },
  {
    id: `2405`,
    name: `Al Adowa`,
    nameAr: `العدوة`
  },
  {
    id: `2406`,
    name: `Beni Mazar`,
    nameAr: `بني مزار`
  },
  {
    id: `2407`,
    name: `Der Mowas`,
    nameAr: `ديرمواس`
  },
  {
    id: `2408`,
    name: `Samalot`,
    nameAr: `سمالوط`
  },
  {
    id: `2409`,
    name: `Matay`,
    nameAr: `مطاي`
  },
  {
    id: `2410`,
    name: `Mghagha`,
    nameAr: `مغاغة`
  },
  {
    id: `2411`,
    name: `Milwy Qism`,
    nameAr: `قسم ملوي`
  },
  {
    id: `2412`,
    name: `Milwy`,
    nameAr: `ملوي المنيا`
  },
  {
    id: `2503`,
    name: `Assiout`,
    nameAr: `أبنوب`
  },
  {
    id: `2504`,
    name: `Abnob`,
    nameAr: `أسيوط`
  },
  {
    id: `2505`,
    name: `Abo Teeg`,
    nameAr: `ديروط`
  },
  {
    id: `2506`,
    name: `Al Badari`,
    nameAr: `البداري`
  },
  {
    id: `2507`,
    name: `Sahal Sleem`,
    nameAr: `ساحل سليم`
  },
  {
    id: `2508`,
    name: `Al Ganaeem`,
    nameAr: `الغنايم`
  },
  {
    id: `2509`,
    name: `Al Kossia`,
    nameAr: `القوصية`
  },
  {
    id: `2510`,
    name: `Dairot`,
    nameAr: `أبو تيج`
  },
  {
    id: `2511`,
    name: `Sadfa`,
    nameAr: `صدفا`
  },
  {
    id: `2512`,
    name: `Manfalot`,
    nameAr: `منفلوط`
  },
  {
    id: `2513`,
    name: `Al Fath`,
    nameAr: `الفتح`
  },
  {
    id: `2514`,
    name: `New Assiout City`,
    nameAr: `مدينة أسيوط الجديدة`
  },
  {
    id: `2603`,
    name: `Sohag`,
    nameAr: `سوهاج`
  },
  {
    id: `2604`,
    name: `Akhmeem`,
    nameAr: `أخميم`
  },
  {
    id: `2605`,
    name: `Al Bleena`,
    nameAr: `البلينا`
  },
  {
    id: `2606`,
    name: `Al Mragha`,
    nameAr: `المراغة`
  },
  {
    id: `2607`,
    name: `Al Monsha'ah`,
    nameAr: `المنشأة`
  },
  {
    id: `2608`,
    name: `Dar Al Salam`,
    nameAr: `دار السلام`
  },
  {
    id: `2610`,
    name: `Gerga`,
    nameAr: `جرجا`
  },
  {
    id: `2611`,
    name: `Western Gohina`,
    nameAr: `جهينة غرب`
  },
  {
    id: `2612`,
    name: `Sakalta`,
    nameAr: `ساقلتة`
  },
  {
    id: `2613`,
    name: `Tama`,
    nameAr: `طما`
  },
  {
    id: `2614`,
    name: `Tahta`,
    nameAr: `طهطا`
  },
  {
    id: `2616`,
    name: `Alkawthr`,
    nameAr: `الكوثر`
  },
  {
    id: `2617`,
    name: `Al Osirat`,
    nameAr: `العسيرات`
  },
  {
    id: `2618`,
    name: `New Akhmem City`,
    nameAr: `مدينة أخميم الجديدة`
  },
  {
    id: `2619`,
    name: `New Sohag City`,
    nameAr: `مدينة سوهاج الجديدة`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2699`,
    name: `Desert`,
    nameAr: `صحراء`
  },
  {
    id: `2701`,
    name: `Qena`,
    nameAr: `قنا`
  },
  {
    id: `2703`,
    name: `Abo Tesht`,
    nameAr: `أبو تشت`
  },
  {
    id: `2706`,
    name: `Nagi Hammadi`,
    nameAr: `نجع حمادي`
  },
  {
    id: `2707`,
    name: `Qous`,
    nameAr: `قوص`
  },
  {
    id: `2709`,
    name: `Naqada`,
    nameAr: `نقادة`
  },
  {
    id: `2710`,
    name: `Farshut`,
    nameAr: `فرشوط`
  },
  {
    id: `2711`,
    name: `Qift`,
    nameAr: `قفط`
  },
  {
    id: `2712`,
    name: `Al Waqf`,
    nameAr: `الوقف`
  },
  {
    id: `2713`,
    name: `New Qena City`,
    nameAr: `مدينة قنا الجديدة`
  },
  {
    id: `2801`,
    name: `Aswan`,
    nameAr: `أسوان`
  },
  {
    id: `2803`,
    name: `Edfu`,
    nameAr: `إدفو`
  },
  {
    id: `2804`,
    name: `Kom Ombo`,
    nameAr: `كوم أمبو`
  },
  {
    id: `2805`,
    name: `Nasr`,
    nameAr: `ناصر`
  },
  {
    id: `2806`,
    name: `Daraw`,
    nameAr: `درو`
  },
  {
    id: `2807`,
    name: `Abu Simbel`,
    nameAr: `أبو سمبل`
  },
  {
    id: `2808`,
    name: `New Aswan City`,
    nameAr: `مدينة أسوان الجديدة`
  },
  {
    id: `2809`,
    name: `New Toshka City`,
    nameAr: `مدينة توشكى الجديدة`
  },
  {
    id: `2901`,
    name: `Luxor`,
    nameAr: `الأقصر`
  },
  {
    id: `2903`,
    name: `Teba`,
    nameAr: `طيبة`
  },
  {
    id: `2904`,
    name: `Arment`,
    nameAr: `أرمنت`
  },
  {
    id: `2905`,
    name: `Esna`,
    nameAr: `إسنا`
  },
  {
    id: `3101`,
    name: `Hurghada`,
    nameAr: `الغردقة`
  },
  {
    id: `3102`,
    name: `Al Qusir`,
    nameAr: `القصير`
  },
  {
    id: `3103`,
    name: `Safaga`,
    nameAr: `سفاجة`
  },
  {
    id: `3104`,
    name: `Marsa Alam`,
    nameAr: `مرسى علم`
  },
  {
    id: `3105`,
    name: `Ra's Gharib`,
    nameAr: `رأس غريب`
  },
  {
    id: `3106`,
    name: `Shalateen`,
    nameAr: `شلاتين`
  },
  {
    id: `3107`,
    name: `Halaib`,
    nameAr: `حلايب`
  },
  {
    id: `3201`,
    name: `Al Kharga`,
    nameAr: `الخارجة`
  },
  {
    id: `3202`,
    name: `Al Dakhla`,
    nameAr: `الداخلة`
  },
  {
    id: `3203`,
    name: `Al Farafra`,
    nameAr: `الفرافرة`
  },
  {
    id: `3204`,
    name: `Paris`,
    nameAr: `باريس`
  },
  {
    id: `3205`,
    name: `Shark Elowinat`,
    nameAr: `شرق العوينات`
  },
  {
    id: `3301`,
    name: `Marsa Matrouh`,
    nameAr: `مرسى مطروح`
  },
  {
    id: `3302`,
    name: `Al Hammam`,
    nameAr: `الحمام`
  },
  {
    id: `3303`,
    name: `Al Sallum`,
    nameAr: `السلوم`
  },
  {
    id: `3304`,
    name: `Al Dab'a`,
    nameAr: `الضبعة `
  },
  {
    id: `3305`,
    name: `Sidi Barrani`,
    nameAr: `سيدي براني`
  },
  {
    id: `3306`,
    name: `Siwa`,
    nameAr: `سيوة`
  },
  {
    id: `3307`,
    name: `Marina Al Alameen`,
    nameAr: `مارينا العلمين`
  },
  {
    id: `3308`,
    name: `Alsahel Alshamali`,
    nameAr: `الساحل الشمالي`
  },
  {
    id: `3308`,
    name: `Alsahel Alshamali`,
    nameAr: `الساحل الشمالي`
  },
  {
    id: `3401`,
    name: `Al Areesh`,
    nameAr: `العريش`
  },
  {
    id: `3405`,
    name: `Bir Al Abd`,
    nameAr: `بئر العبد`
  },
  {
    id: `3406`,
    name: `Al Hasna`,
    nameAr: `الحسنة`
  },
  {
    id: `3407`,
    name: `Nakl`,
    nameAr: `نخل`
  },
  {
    id: `3408`,
    name: `Al Shekh Zwid`,
    nameAr: `الشيخ زويد`
  },
  {
    id: `3409`,
    name: `Rafh`,
    nameAr: `رفح`
  },
  {
    id: `3410`,
    name: `Rmana`,
    nameAr: `رمانة`
  },
  {
    id: `3411`,
    name: `Al Kassima`,
    nameAr: `القسيمة`
  },
  {
    id: `3501`,
    name: `Al Toor`,
    nameAr: `الطور`
  },
  {
    id: `3502`,
    name: `Ras Sedr`,
    nameAr: `رأس سدر`
  },
  {
    id: `3503`,
    name: `Abo Redis`,
    nameAr: `أبود رديس`
  },
  {
    id: `3504`,
    name: `Saint Katrin`,
    nameAr: `سانت كاترين`
  },
  {
    id: `3505`,
    name: `Sharm Al Shiekh`,
    nameAr: `شرم الشيخ`
  },
  {
    id: `3506`,
    name: `Dahab`,
    nameAr: `دهب`
  },
  {
    id: `3507`,
    name: `Nuwayba`,
    nameAr: `نويبع`
  },
  {
    id: `3508`,
    name: `Taba`,
    nameAr: `طابا`
  },
  {
    id: `3599`,
    name: `Abo Redis Desert`,
    nameAr: `صحراء أبو رديس`
  }
];

module.exports.byId = function (id) {
  console.log('test: ', districts.find((d) => d.id === '1501'));
  id = +id;
  const result = districts.find((d) => d.id === id);
  return result;
};

module.exports.districts = districts;
