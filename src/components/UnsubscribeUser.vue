<template>
  <div>
    <v-col cols="auto">
      <v-dialog transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-form>
            <v-overlay v-if="loader">
              <div class="text-center">
                <v-progress-circular
                  indeterminate
                  color="red"
                  :size="100"
                  :width="9"
                ></v-progress-circular>
              </div>
            </v-overlay>
            <v-text-field v-model="name" label="Name" required></v-text-field>
            <v-text-field
              v-model="number"
              :rules="numberRules"
              :counter="10"
              label="Mobile Number"
              required
            ></v-text-field>
            <v-btn
              color="green white--text"
              block
              @click="postToUnsubcribeUser"
              v-bind="attrs"
              v-on="on"
            >
              Submit
            </v-btn>
          </v-form>
        </template>
        <template v-slot:default="dialog">
          <v-card v-if="userUnsubscribedStatus == 200">
            <v-toolbar color="green" dark
              >Thank You {{ name }} for using Covaccify 😊</v-toolbar
            >
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                We hope we helped you to get vaccinated
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-if="userUnsubscribedStatus == 202">
            <v-toolbar color="green" dark>Sorry {{ name }} 😔</v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                It appears that you haven't yet registered for Covaccify
                Notifications
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else-if="userUnsubscribedStatus == 201">
            <v-toolbar color="green" dark
              >Sorry {{ name }} 😕, It appears that you haven't filled up the
              complete form</v-toolbar
            >
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                Please fill all the essential entries to get started
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-if="userUnsubscribedStatus == 404">
            <v-toolbar color="green" dark>Sorry {{ name }} 😔(</v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12 pl-0">
                It appears our servers are down for maintenance
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "UnsubscribeUser",
  data() {
    return {
      name: "",
      number: "",
      numberRules: [
        (v) => !!v || "Phone Number is required",
        (v) =>
          (v && v.length <= 10) || "Number must be less than 10 characters",
      ],
      userUnsubscribedStatus: 0,
      loader: false,
    };
  },
  methods: {
    postToUnsubcribeUser() {
      if (this.name && this.number.length == 10) {
        // console.log(this.name, this.number);
        this.loader = true;
        axios({
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          url: "your backend API",
          data: qs.stringify({
            number: this.number,
            name: this.name,
          }),
        })
          .then((dataFromAPI) => {
            console.log(dataFromAPI);
            if (dataFromAPI.status == 200) {
              this.userUnsubscribedStatus = 200;
              console.log(
                "User unsubsrcribbed successfully and mail is sent as well" +
                  dataFromAPI
              );
              this.loader = false;
            } else if (dataFromAPI.status == 202) {
              this.userUnsubscribedStatus = 202;
              console.log("User doesn't exist in our Database");
              this.loader = false;
            }
          })
          .catch((err) => {
            this.userUnsubscribedStatus = 404;
            console.log(err + "OP OP");
            this.loader = false;
          });
      } else {
        this.userUnsubscribedStatus = 201;
        console.log("User hasn't filled the form completely");
      }
    },
  },
};
</script>
