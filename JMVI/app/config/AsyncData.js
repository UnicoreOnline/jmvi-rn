import React, { Component } from 'react'

// import {
//   AsyncStorage
// } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import API from './API'
import Utility from './Utility'

var AsyncData = module.exports = {};

AsyncData.keys = {
  birth_settings: 'birth_settings',
  bp_during_labor_i_like: 'bp_during_labor_i_like',
  bp_spend_the_first_stage_labor: 'bp_spend_the_first_stage_labor',
  bp_not_interested_in: 'bp_not_interested_in',
  bp_fetal_monitoring_to_be: 'bp_fetal_monitoring_to_be',
  bp_labor_augmentation: 'bp_labor_augmentation',
  bp_for_pain_relief: 'bp_for_pain_relief',
  bp_during_delivery: 'bp_during_delivery',
  bp_will_bring: 'bp_will_bring',
  bp_baby_is_delivered_would_like: 'bp_baby_is_delivered_would_like',
  bp_would_like_an_episiotomy: 'bp_would_like_an_episiotomy',
  bp_immediately_after_delivery: 'bp_immediately_after_delivery',
  bp_if_c_section_is_necessary: 'bp_if_c_section_is_necessary',
  bp_would_like_to_hold_baby: 'bp_would_like_to_hold_baby',
  bp_would_like_to_breastfeed: 'bp_would_like_to_breastfeed',
  bp_would_like_my_family_members: 'bp_would_like_my_family_members',
  bp_baby_medical_exam: 'bp_baby_medical_exam',
  bp_dont_give_baby: 'bp_dont_give_baby',
  bp_like_baby_first_bath_given: 'bp_like_baby_first_bath_given',
  bp_like_to_feed_baby: 'bp_like_to_feed_baby',
  bp_like_baby_stay_in_room: 'bp_like_baby_stay_in_room',
  bp_like_my_partner: 'bp_like_my_partner',
  bp_if_boy_circumcision: 'bp_if_boy_circumcision',
  bp_needed_post_delivery_give: 'bp_needed_post_delivery_give',
  bp_after_birth_stay_in_hospital: 'bp_after_birth_stay_in_hospital',
  bp_baby_is_not_well: 'bp_baby_is_not_well',
  bp_planned_delivery: 'bp_planned_delivery',
  ep_previous_births: 'ep_previous_births',
  ep_healthcare_provider: 'ep_healthcare_provider',
  ep_prefered_delivery_method: 'ep_prefered_delivery_method',
  note_values: 'note_values',
  support: 'support',
  fcm_token: 'fcm_token',



  deep_link_params: 'deep_link_params',
  category: 'category',
  video_slug: 'video_slug',
}

AsyncData.saveAsyncData = async (key, mArray) => {
  let serviceJson = JSON.stringify(mArray)
  AsyncStorage.setItem("@MyStore:" + key, serviceJson);
};
AsyncData.saveAsyncDataString = async (key, value) => {
  AsyncStorage.setItem("@MyStore:" + key, value);
};

AsyncData.getAsyncData = function (completion, key) {
  AsyncStorage.getItem("@MyStore:" + key).then((value) => {
    completion(value)
  }).done();
};

/* ----------------------- Agent List ----------------------- */

AsyncData.getAgentList = function (completion) {
  AsyncStorage.getItem("agents").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getAgents((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getAgents = function (completion) {
  var params = {
    api_key: Utility.API_KEY,
            'get_agents': 1,
  }
  API.getRequest('get_data.php', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('agents', data.agents);
      completion(data.agents)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */
/* ----------------------- Property Type List ----------------------- */

AsyncData.getPropertyTypeList = function (completion) {
  AsyncStorage.getItem("propertytypes").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getPropertyTypes((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getPropertyTypes = function (completion) {
  var params = {
    api_key: Utility.API_KEY,
            'get_propertytypes': 1,
  }
  API.getRequest('get_data.php', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('propertytypes', data.property_types);
      completion(data.property_types)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */
/* ----------------------- Country List ----------------------- */

AsyncData.getCountryList = function (completion) {
  AsyncStorage.getItem("country").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getCountry((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getCountry = function (completion) {
  var params = {
    api_key: Utility.API_KEY,
            'get_country': 1,
  }
  API.getRequest('get_data.php', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('country', data.country);
      completion(data.country)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- Service Master - Home ----------------------- */

AsyncData.getServiceMasterList = function (completion) {
  AsyncStorage.getItem("@MyStore:services_master").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getServiceMaster((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getServiceMaster = function (completion) {
  var params = {
    // "type": 'service',
  }
  API.postRequest('service-master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('services_master', data.data);
      completion(data.data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- Doula Filter Languages ----------------------- */
AsyncData.getFilterLanguageList = function (completion) {
  AsyncStorage.getItem("@MyStore:filter_language").then((jsonString) => {
    const mArray = JSON.parse(jsonString);
    if (mArray != null && mArray.length > 0) {
      completion(mArray)
    } else {
      AsyncData.getFilterLanguage((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getFilterLanguage = function (completion) {
  var params = {
    // "type": 'language',
  }
  API.postRequest('range-master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('filter_language', data.data.language_data);
      completion(data.data.language_data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */


/* ----------------------- All Languages ----------------------- */
AsyncData.getLanguageList = function (completion) {
  AsyncStorage.getItem("@MyStore:language").then((jsonString) => {
    const mArray = JSON.parse(jsonString);
    if (mArray != null && mArray.length > 0) {
      completion(mArray)
    } else {
      AsyncData.getLanguage((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getLanguage = function (completion) {
  var params = {
    "type": 'language',
  }
  API.postRequest('master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('language', data.data);
      completion(data.data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- All Services ----------------------- */

AsyncData.getAllServiceList = function (completion) {
  AsyncStorage.getItem("@MyStore:all_services").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getAllServices((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getAllServices = function (completion) {
  var params = {
    "type": 'service',
  }
  API.postRequest('master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('all_services', data.data);
      completion(data.data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- Social Links Services ----------------------- */

AsyncData.getAllSocialLinkList = function (completion) {
  AsyncStorage.getItem("@MyStore:social_links").then((servicesString) => {
    const servicesArray = JSON.parse(servicesString);
    // console.log("servicesArray>>>", servicesArray)
    if (servicesArray != null && servicesArray.length > 0) {
      completion(servicesArray)
    } else {
      AsyncData.getAllSocialLink((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getAllSocialLink = function (completion) {
  var params = {
    "type": 'social-links',
  }
  API.postRequest('master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('social_links', data.data);
      completion(data.data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */


/* ----------------------- Birth Settings ----------------------- */
AsyncData.getBirthSettingsList = function (completion) {
  AsyncStorage.getItem("@MyStore:birth_settings").then((servicesString) => {
    const mArray = JSON.parse(servicesString);
    // console.log("mArray>>>", mArray)
    if (mArray != null && mArray.length > 0) {
      completion(mArray)
    } else {
      AsyncData.getBirthSettings((data) => {
        completion(data)
      });
    }
  }).done();
}

AsyncData.getBirthSettings = function (completion) {
  var params = {
    "type": 'birth-settings',
  }
  API.postRequest('master', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData('birth_settings', data.data);
      completion(data.data)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- Birth Fields ----------------------- */

AsyncData.getListOfKeyFromAPI = function (completion, key) {
  AsyncStorage.getItem("@MyStore:" + key).then((servicesString) => {
    const mArray = JSON.parse(servicesString);
    if (mArray != null && mArray.length > 0) {
      completion(mArray, key)
    } else {
      AsyncData.getBirthPlanFields((data, key) => {
        console.log('AAAAAA ', key);
        completion(data, key)
      });
    }
  }).done();
}

AsyncData.getBirthPlanFields = function (completion, key) {
  var params = {
  }
  API.postRequest('birth-plan-fields', params, (status, data) => {
    if (status) {
      AsyncData.saveAsyncData(AsyncData.keys.bp_during_labor_i_like, data.data.bp_during_labor_i_like);
      AsyncData.saveAsyncData(AsyncData.keys.bp_spend_the_first_stage_labor, data.data.bp_spend_the_first_stage_labor);
      AsyncData.saveAsyncData(AsyncData.keys.bp_not_interested_in, data.data.bp_not_interested_in);
      AsyncData.saveAsyncData(AsyncData.keys.bp_fetal_monitoring_to_be, data.data.bp_fetal_monitoring_to_be);
      AsyncData.saveAsyncData(AsyncData.keys.bp_labor_augmentation, data.data.bp_labor_augmentation);
      AsyncData.saveAsyncData(AsyncData.keys.bp_for_pain_relief, data.data.bp_for_pain_relief);
      AsyncData.saveAsyncData(AsyncData.keys.bp_during_delivery, data.data.bp_during_delivery);
      AsyncData.saveAsyncData(AsyncData.keys.bp_will_bring, data.data.bp_will_bring);
      AsyncData.saveAsyncData(AsyncData.keys.bp_baby_is_delivered_would_like, data.data.bp_baby_is_delivered_would_like);
      AsyncData.saveAsyncData(AsyncData.keys.bp_would_like_an_episiotomy, data.data.bp_would_like_an_episiotomy);
      AsyncData.saveAsyncData(AsyncData.keys.bp_immediately_after_delivery, data.data.bp_immediately_after_delivery);
      AsyncData.saveAsyncData(AsyncData.keys.bp_if_c_section_is_necessary, data.data.bp_if_c_section_is_necessary);
      AsyncData.saveAsyncData(AsyncData.keys.bp_would_like_to_hold_baby, data.data.bp_would_like_to_hold_baby);
      AsyncData.saveAsyncData(AsyncData.keys.bp_would_like_to_breastfeed, data.data.bp_would_like_to_breastfeed);
      AsyncData.saveAsyncData(AsyncData.keys.bp_would_like_my_family_members, data.data.bp_would_like_my_family_members);
      AsyncData.saveAsyncData(AsyncData.keys.bp_baby_medical_exam, data.data.bp_baby_medical_exam);
      AsyncData.saveAsyncData(AsyncData.keys.bp_dont_give_baby, data.data.bp_dont_give_baby);
      AsyncData.saveAsyncData(AsyncData.keys.bp_like_baby_first_bath_given, data.data.bp_like_baby_first_bath_given);
      AsyncData.saveAsyncData(AsyncData.keys.bp_like_to_feed_baby, data.data.bp_like_to_feed_baby);
      AsyncData.saveAsyncData(AsyncData.keys.bp_like_baby_stay_in_room, data.data.bp_like_baby_stay_in_room);
      AsyncData.saveAsyncData(AsyncData.keys.bp_like_my_partner, data.data.bp_like_my_partner);
      AsyncData.saveAsyncData(AsyncData.keys.bp_if_boy_circumcision, data.data.bp_if_boy_circumcision);
      AsyncData.saveAsyncData(AsyncData.keys.bp_needed_post_delivery_give, data.data.bp_needed_post_delivery_give);
      AsyncData.saveAsyncData(AsyncData.keys.bp_after_birth_stay_in_hospital, data.data.bp_after_birth_stay_in_hospital);
      AsyncData.saveAsyncData(AsyncData.keys.bp_baby_is_not_well, data.data.bp_baby_is_not_well);
      AsyncData.saveAsyncData(AsyncData.keys.bp_planned_delivery, data.data.bp_planned_delivery);
      AsyncData.saveAsyncData(AsyncData.keys.ep_previous_births, data.data.ep_previous_births);
      AsyncData.saveAsyncData(AsyncData.keys.ep_healthcare_provider, data.data.ep_healthcare_provider);
      AsyncData.saveAsyncData(AsyncData.keys.ep_prefered_delivery_method, data.data.ep_prefered_delivery_method);
      AsyncData.saveAsyncData(AsyncData.keys.note_values, data.data.note_values);
      AsyncData.saveAsyncData(AsyncData.keys.support, data.data.support);

      Utility.arrBp_during_labor_i_like = data.data.bp_during_labor_i_like;
      Utility.arrBp_spend_the_first_stage_labor = data.data.bp_spend_the_first_stage_labor;
      Utility.arrBp_not_interested_in = data.data.bp_not_interested_in;
      Utility.arrBp_fetal_monitoring_to_be = data.data.bp_fetal_monitoring_to_be;
      Utility.arrBp_labor_augmentation = data.data.bp_labor_augmentation;
      Utility.arrBp_for_pain_relief = data.data.bp_for_pain_relief;
      Utility.arrBp_during_delivery = data.data.bp_during_delivery;
      Utility.arrBp_will_bring = data.data.bp_will_bring;
      Utility.arrBp_baby_is_delivered_would_like = data.data.bp_baby_is_delivered_would_like;
      Utility.arrBp_would_like_an_episiotomy = data.data.bp_would_like_an_episiotomy;
      Utility.arrBp_immediately_after_delivery = data.data.bp_immediately_after_delivery;
      Utility.arrBp_if_c_section_is_necessary = data.data.bp_if_c_section_is_necessary;
      Utility.arrBp_would_like_to_hold_baby = data.data.bp_would_like_to_hold_baby;
      Utility.arrBp_would_like_to_breastfeed = data.data.bp_would_like_to_breastfeed;
      Utility.arrBp_would_like_my_family_members = data.data.bp_would_like_my_family_members;
      Utility.arrBp_baby_medical_exam = data.data.bp_baby_medical_exam;
      Utility.arrBp_dont_give_baby = data.data.bp_dont_give_baby;
      Utility.arrBp_like_baby_first_bath_given = data.data.bp_like_baby_first_bath_given;
      Utility.arrBp_like_to_feed_baby = data.data.bp_like_to_feed_baby;
      Utility.arrBp_like_baby_stay_in_room = data.data.bp_like_baby_stay_in_room;
      Utility.arrBp_like_my_partner = data.data.bp_like_my_partner;
      Utility.arrBp_if_boy_circumcision = data.data.bp_if_boy_circumcision;
      Utility.arrBp_needed_post_delivery_give = data.data.bp_needed_post_delivery_give;
      Utility.arrBp_after_birth_stay_in_hospital = data.data.bp_after_birth_stay_in_hospital;
      Utility.arrBp_baby_is_not_well = data.data.bp_baby_is_not_well;
      Utility.arrBp_planned_delivery = data.data.bp_planned_delivery;
      Utility.arrEp_previous_births = data.data.ep_previous_births;
      Utility.arrEp_healthcare_provider = data.data.ep_healthcare_provider;
      Utility.arrEp_prefered_delivery_method = data.data.ep_prefered_delivery_method;
      Utility.arrNote_values = data.data.note_values;
      Utility.arrSupport = data.data.support;

      completion(data.data, key)
    }
  }, true);
}
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */

/* ----------------------- Range Master ----------------------- */
// AsyncData.getRangeMaster = function () {
//   var params = {}
//   API.postRequest('range-master', params, (status, data) => {
//     if (status) {
//       // AsyncData.saveAsyncData('family_min', data.data.families_served.min);
//       // AsyncData.saveAsyncData('family_max', data.data.families_served.max);
//       // AsyncData.saveAsyncData('exp_min', data.data.years_of_experiance.min);
//       // AsyncData.saveAsyncData('exp_max', data.data.years_of_experiance.max);
//       // AsyncData.saveAsyncData('const_family_min', data.data.families_served.min);
//       // AsyncData.saveAsyncData('const_family_max', data.data.families_served.max);
//       // AsyncData.saveAsyncData('const_exp_min', data.data.years_of_experiance.min);
//       // AsyncData.saveAsyncData('const_exp_max', data.data.years_of_experiance.max);
//       // AsyncData.saveAsyncData('language_data', data.data.language_data);
//         //For filter screen

//       Utility.family_min = data.data.families_served.min;
//       Utility.family_max = data.data.families_served.max;
//       Utility.exp_min = data.data.years_of_experiance.min;
//       Utility.exp_max = data.data.years_of_experiance.max;
//       Utility.const_family_min = data.data.families_served.min;
//       Utility.const_family_max = data.data.families_served.max;
//       Utility.const_exp_min = data.data.years_of_experiance.min;
//       Utility.const_exp_max = data.data.years_of_experiance.max;
//       Utility.arrFilterLanguages = data.data.language_data;
//       console.log('Utility.family_min', Utility.family_min,' - ',data.data.families_served.min)
//       console.log('Utility.family_max', Utility.family_max,' - ',data.data.families_served.max)
//       console.log('Utility.exp_min', Utility.exp_min,' - ',data.data.years_of_experiance.min)
//       console.log('Utility.exp_max', Utility.exp_max,' - ',data.data.years_of_experiance.max)
//       console.log('Utility.const_family_min', Utility.const_family_min,' - ',data.data.families_served.min)
//       console.log('Utility.const_family_max', Utility.const_family_max,' - ',data.data.families_served.max)
//       console.log('Utility.const_exp_min', Utility.const_exp_min,' - ',data.data.years_of_experiance.min)
//       console.log('Utility.const_exp_max', Utility.const_exp_max,' - ',data.data.years_of_experiance.max)
//       console.log('Utility.arrFilterLanguages', Utility.arrFilterLanguages,' - ',data.data.language_data)
//       // completion(data.data)
//     }
//   }, true);
// }
/* ----------------------- xxxxxxxxxxxxxxxxx ----------------------- */