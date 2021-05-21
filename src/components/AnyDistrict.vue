<template>
  <div>
    <div>
      <v-container>
        <v-autocomplete
          :items="statesArray"
          v-model="selectedState"
          label="Select State"
          required
        >
        </v-autocomplete>
        <v-autocomplete
          :items="districtsArray"
          v-model="selectedDistrict"
          label="Select District"
          required
        >
        </v-autocomplete>
        <v-autocomplete
          :items="[18, 45]"
          v-model="selectAge"
          label="Select Minimum Age"
          required
        >
        </v-autocomplete>
        <v-btn block color="green white--text" @click="showCenters"
          >Search</v-btn
        >
      </v-container>
      <v-container>
        <div v-if="metaData.length > 0">
          <h3>{{ greet }}</h3>
          <v-card
            v-for="center in metaDataOP"
            :key="center.center_id"
            class="mx-auto mb-6"
            max-width="350"
          >
            <v-card-title>
              {{ center.name }}
            </v-card-title>

            <v-card-subtitle> Address:{{ center.address }} </v-card-subtitle>

            <v-card-actions>
              <v-btn color="green" text>
                Learn More
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn icon @click="center.show = !center.show">
                <v-icon color="green">{{
                  center.show ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="center.show">
                <v-divider></v-divider>

                <v-card-text>
                  <v-row
                    v-for="session in center.sessions"
                    :key="session.session_id"
                  >
                    <v-col cols="6">Date Available:</v-col
                    ><v-col cols="6">{{ session.date }}</v-col>
                    <v-col cols="6">Available capacity:</v-col
                    ><v-col cols="6">{{ session.available_capacity }}</v-col>
                    <v-col cols="6">Fee Type:</v-col
                    ><v-col cols="6">{{ center.fee_type }}</v-col>
                    <v-col cols="6">Vaccine Name:</v-col
                    ><v-col cols="6">{{ session.vaccine }}</v-col>
                    <v-chip-group active-class="green white--text" column>
                      <v-chip v-for="slot in session.slots" :key="slot">{{
                        slot
                      }}</v-chip>
                    </v-chip-group>
                  </v-row>
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
        <div v-if="showForm">
          <GetSms :displaySorry="showForm"></GetSms>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GetSms from "./GetSMS.vue";
export default {
  components: { GetSms },
  name: "MyWishlist",
  data() {
    return {
      clickedFirst: false,
      wholeStatesData: [],
      statesArray: [],
      selectedState: "",
      selectedStateID: "",
      wholeDistrictsData: [],
      districtsArray: [],
      selectedDistrict: "",
      selectedDistrictID: "",
      selectAge: "",
      dateOP: new Date().getDate(),
      monthOP: new Date().getMonth() + 1,
      yearOP: new Date().getFullYear(),
      dateFormatted: "",
      metaData: [],
      metaDataOP: [],
      showForm: false,
      greet: "",
    };
  },
  watch: {
    selectedState(value) {
      this.getStateIDAndDisplayDistricts(value);
      console.log(value);
    },
    metaDataOP(value) {
      setTimeout(() => {
        if (value.length > 0) {
          this.showForm = false;
          this.greet = `${value.length} Centers are available`;
        } else {
          this.showForm = true;
          this.greet = "";
        }
      }, 4000);
    },
  },
  methods: {
    getStateIDAndDisplayDistricts(value) {
      this.districtsArray = [];
      this.wholeStatesData.map((state) => {
        if (state.state_name == value) {
          this.selectedStateID = state.state_id;
          this.selectedStateID = this.selectedStateID.toString();
        }
      });
      axios
        .get(
          "https://cdn-api.co-vin.in/api/v2/admin/location/districts/" +
            this.selectedStateID
        )
        .then((districtData) => {
          console.log(districtData.data.districts);
          this.wholeDistrictsData = districtData.data.districts;
          this.wholeDistrictsData.map((district) => {
            this.districtsArray.push(district.district_name);
          });
        });
    },
    showCenters() {
      this.greet = "";
      this.metaDataOP = [];
      this.metaData = [];
      this.wholeDistrictsData.map((district) => {
        if (district.district_name == this.selectedDistrict) {
          this.selectedDistrictID = district.district_id.toString();
        }
      });
      this.dateFormatted = this.dateOP + "-" + this.monthOP + "-" + this.yearOP;
      axios
        .get(
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" +
            this.selectedDistrictID +
            "&date=" +
            this.dateFormatted
        )
        .then((data) => {
          //   console.log(data.data);
          data.data.centers.map((center) => {
            var intermediate = {
              name: center.name,
              address: center.address,
              fee_type: center.fee_type,
              sessions: [],
            };
            center.sessions.map((session) => {
              if (
                session.min_age_limit == this.selectAge &&
                session.available_capacity > 1
              ) {
                intermediate.show = false;
                intermediate.selection = 1;
                var intermediateSession = {
                  date: session.date,
                  available_capacity: session.available_capacity,
                  vaccine: session.vaccine,
                  slots: session.slots,
                  min_age_limit: session.min_age_limit,
                };
                intermediate.sessions.push(intermediateSession);
              }
            });
            this.metaData.push(intermediate);
          });
          this.metaDataOP = this.metaData.filter((center) => {
            if (center.sessions.length > 0) {
              return this.metaDataOP;
            }
          });
        });
      setTimeout(() => {
        if (this.metaDataOP.length == 0) {
          this.showForm = true;
        }
      }, 3000);

      // console.log(this.metaDataOP);
    },
  },
  async mounted() {
    await axios
      .get("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((response) => {
        this.wholeStatesData = response.data.states;
        response.data.states.map((state) => {
          this.statesArray.push(state.state_name);
        });
      });
  },
};
</script>
