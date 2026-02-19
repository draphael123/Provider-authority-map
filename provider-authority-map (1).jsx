import { useState, useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";

// ── Real Fountain licensing data ──────────────────────────────────────────────
const RAW_RECORDS = [{"provider":"Doron  Stember, MD","state":"AL","stateLabel":"AL","license":"41855"},{"provider":"Doron  Stember, MD","state":"AZ","stateLabel":"AZ","license":"63243"},{"provider":"Doron  Stember, MD","state":"AR","stateLabel":"AR","license":"E-17391"},{"provider":"Doron  Stember, MD","state":"CA","stateLabel":"CA","license":"171359"},{"provider":"Doron  Stember, MD","state":"CO","stateLabel":"CO","license":"DR.0067368"},{"provider":"Doron  Stember, MD","state":"CT","stateLabel":"CT","license":"1.068713"},{"provider":"Doron  Stember, MD","state":"FL","stateLabel":"FL","license":"ME147501"},{"provider":"Doron  Stember, MD","state":"GA","stateLabel":"GA","license":"89666"},{"provider":"Doron  Stember, MD","state":"ID","stateLabel":"ID","license":"M-17553"},{"provider":"Doron  Stember, MD","state":"IL","stateLabel":"IL","license":"036155878"},{"provider":"Doron  Stember, MD","state":"IL","stateLabel":"IL CSR","license":"336.115573"},{"provider":"Doron  Stember, MD","state":"IN","stateLabel":"IN","license":"01087380A"},{"provider":"Doron  Stember, MD","state":"KY","stateLabel":"KY","license":"57464"},{"provider":"Doron  Stember, MD","state":"ME","stateLabel":"ME","license":"MD27544"},{"provider":"Doron  Stember, MD","state":"MD","stateLabel":"MD","license":"D0099399"},{"provider":"Doron  Stember, MD","state":"MD","stateLabel":"MD CSR","license":"M121508"},{"provider":"Doron  Stember, MD","state":"MI","stateLabel":"MI","license":"4301503834"},{"provider":"Doron  Stember, MD","state":"MO","stateLabel":"MO","license":"2022033807"},{"provider":"Doron  Stember, MD","state":"MT","stateLabel":"MT","license":"MED-PHYS-LIC-130893"},{"provider":"Doron  Stember, MD","state":"NE","stateLabel":"NE","license":"36076"},{"provider":"Doron  Stember, MD","state":"NH","stateLabel":"NH","license":"25252"},{"provider":"Doron  Stember, MD","state":"NJ","stateLabel":"NJ","license":"25MA11008000"},{"provider":"Doron  Stember, MD","state":"NJ","stateLabel":"NJ CSR","license":"D13076600"},{"provider":"Doron  Stember, MD","state":"NY","stateLabel":"NY","license":"241937"},{"provider":"Doron  Stember, MD","state":"NC","stateLabel":"NC","license":"2021-01771"},{"provider":"Doron  Stember, MD","state":"OH","stateLabel":"OH","license":"35.141234"},{"provider":"Doron  Stember, MD","state":"PA","stateLabel":"PA","license":"MD475300"},{"provider":"Doron  Stember, MD","state":"SC","stateLabel":"SC","license":"91562"},{"provider":"Doron  Stember, MD","state":"TN","stateLabel":"TN","license":"62339"},{"provider":"Doron  Stember, MD","state":"TX","stateLabel":"TX","license":"S9802"},{"provider":"Doron  Stember, MD","state":"UT","stateLabel":"UT","license":"12659039-1205"},{"provider":"Doron  Stember, MD","state":"UT","stateLabel":"UT CSR","license":"12659039-8905"},{"provider":"Doron  Stember, MD","state":"VA","stateLabel":"VA","license":"0101272776"},{"provider":"Doron  Stember, MD","state":"WA","stateLabel":"WA","license":"MD61135626"},{"provider":"Doron  Stember, MD","state":"WI","stateLabel":"WI","license":"76112-20"},{"provider":"Tzvi  Doron, DO","state":"AL","stateLabel":"AL","license":"DO.2072"},{"provider":"Tzvi  Doron, DO","state":"AK","stateLabel":"AK","license":"166768"},{"provider":"Tzvi  Doron, DO","state":"AZ","stateLabel":"AZ","license":"007573"},{"provider":"Tzvi  Doron, DO","state":"AR","stateLabel":"AR","license":"E-13698"},{"provider":"Tzvi  Doron, DO","state":"CA","stateLabel":"CA","license":"16512"},{"provider":"Tzvi  Doron, DO","state":"CO","stateLabel":"CO","license":"DR.0061329"},{"provider":"Tzvi  Doron, DO","state":"CT","stateLabel":"CT","license":"62346"},{"provider":"Tzvi  Doron, DO","state":"DC","stateLabel":"DC","license":"DO034821"},{"provider":"Tzvi  Doron, DO","state":"DE","stateLabel":"DE","license":"C2-0013543"},{"provider":"Tzvi  Doron, DO","state":"FL","stateLabel":"FL","license":"OS12294"},{"provider":"Tzvi  Doron, DO","state":"GA","stateLabel":"GA","license":"80569"},{"provider":"Tzvi  Doron, DO","state":"HI","stateLabel":"HI","license":"DOS-2121"},{"provider":"Tzvi  Doron, DO","state":"ID","stateLabel":"ID","license":"O-1251"},{"provider":"Tzvi  Doron, DO","state":"IL","stateLabel":"IL","license":"36.14492"},{"provider":"Tzvi  Doron, DO","state":"IN","stateLabel":"IN","license":"02005294A"},{"provider":"Tzvi  Doron, DO","state":"IA","stateLabel":"IA","license":"DO-05278"},{"provider":"Tzvi  Doron, DO","state":"IA","stateLabel":"IA CSR","license":"1352752"},{"provider":"Tzvi  Doron, DO","state":"KS","stateLabel":"KS","license":"05-42297"},{"provider":"Tzvi  Doron, DO","state":"KY","stateLabel":"KY","license":"04247"},{"provider":"Tzvi  Doron, DO","state":"LA","stateLabel":"LA","license":"311727"},{"provider":"Tzvi  Doron, DO","state":"ME","stateLabel":"ME","license":"DO2908"},{"provider":"Tzvi  Doron, DO","state":"MD","stateLabel":"MD","license":"H85318"},{"provider":"Tzvi  Doron, DO","state":"MI","stateLabel":"MI","license":"5101023719"},{"provider":"Tzvi  Doron, DO","state":"MI","stateLabel":"MI CSR","license":"5315262498"},{"provider":"Tzvi  Doron, DO","state":"MN","stateLabel":"MN","license":"65456"},{"provider":"Tzvi  Doron, DO","state":"MS","stateLabel":"MS","license":"26247"},{"provider":"Tzvi  Doron, DO","state":"MO","stateLabel":"MO","license":"2018008117"},{"provider":"Tzvi  Doron, DO","state":"MT","stateLabel":"MT","license":"MED-PHYS-LIC-61180"},{"provider":"Tzvi  Doron, DO","state":"NE","stateLabel":"NE","license":"1896"},{"provider":"Tzvi  Doron, DO","state":"NV","stateLabel":"NV","license":"DO2517"},{"provider":"Tzvi  Doron, DO","state":"NH","stateLabel":"NH","license":"20075"},{"provider":"Tzvi  Doron, DO","state":"NJ","stateLabel":"NJ","license":"25MB10291300"},{"provider":"Tzvi  Doron, DO","state":"NJ","stateLabel":"NJ CSR","license":"D13318100"},{"provider":"Tzvi  Doron, DO","state":"NM","stateLabel":"NM","license":"A-2273-19"},{"provider":"Tzvi  Doron, DO","state":"NM","stateLabel":"NM CSR","license":"CS02327838"},{"provider":"Tzvi  Doron, DO","state":"NY","stateLabel":"NY","license":"287253"},{"provider":"Tzvi  Doron, DO","state":"NC","stateLabel":"NC","license":"2018-01262"},{"provider":"Tzvi  Doron, DO","state":"ND","stateLabel":"ND","license":"16938"},{"provider":"Tzvi  Doron, DO","state":"OH","stateLabel":"OH","license":"34.013543"},{"provider":"Tzvi  Doron, DO","state":"OK","stateLabel":"OK","license":"6646"},{"provider":"Tzvi  Doron, DO","state":"PA","stateLabel":"PA","license":"OS019343"},{"provider":"Tzvi  Doron, DO","state":"RI","stateLabel":"RI","license":"DO00957"},{"provider":"Tzvi  Doron, DO","state":"SC","stateLabel":"SC","license":"82100"},{"provider":"Tzvi  Doron, DO","state":"SD","stateLabel":"SD","license":"12255"},{"provider":"Tzvi  Doron, DO","state":"TN","stateLabel":"TN","license":"DO0000003387"},{"provider":"Tzvi  Doron, DO","state":"TX","stateLabel":"TX","license":"S9872"},{"provider":"Tzvi  Doron, DO","state":"UT","stateLabel":"UT","license":"11220111-1204"},{"provider":"Tzvi  Doron, DO","state":"VT","stateLabel":"VT","license":"32.0133859"},{"provider":"Tzvi  Doron, DO","state":"VA","stateLabel":"VA","license":"102205414"},{"provider":"Tzvi  Doron, DO","state":"WA","stateLabel":"WA","license":"DO.OP.60580714"},{"provider":"Tzvi  Doron, DO","state":"WV","stateLabel":"WV","license":"3491"},{"provider":"Tzvi  Doron, DO","state":"WI","stateLabel":"WI","license":"69944-21"},{"provider":"Tzvi  Doron, DO","state":"WY","stateLabel":"WY","license":"11973A"},{"provider":"Lindsay  Burden","state":"AZ","stateLabel":"AZ","license":"301990"},{"provider":"Lindsay  Burden","state":"CA","stateLabel":"CA","license":"95028432"},{"provider":"Lindsay  Burden","state":"CA","stateLabel":"CA Furnishing","license":"95028432"},{"provider":"Lindsay  Burden","state":"CO","stateLabel":"CO","license":"C-APN.0001159-C-NP"},{"provider":"Lindsay  Burden","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0000733-C-NP"},{"provider":"Lindsay  Burden","state":"FL","stateLabel":"FL","license":"APRN9337451"},{"provider":"Lindsay  Burden","state":"GA","stateLabel":"GA","license":"GAA-NP001853"},{"provider":"Lindsay  Burden","state":"ID","stateLabel":"ID","license":"59814"},{"provider":"Lindsay  Burden","state":"ID","stateLabel":"ID CSR","license":"4161470"},{"provider":"Lindsay  Burden","state":"IL","stateLabel":"IL","license":"277003685"},{"provider":"Lindsay  Burden","state":"IL","stateLabel":"IL CSR","license":"377.003485"},{"provider":"Lindsay  Burden","state":"IN","stateLabel":"IN","license":"71015299A"},{"provider":"Lindsay  Burden","state":"IN","stateLabel":"IN CSR","license":"71015299B"},{"provider":"Lindsay  Burden","state":"IA","stateLabel":"IA","license":"A152602"},{"provider":"Lindsay  Burden","state":"IA","stateLabel":"IA CSR","license":"5208865"},{"provider":"Lindsay  Burden","state":"KS","stateLabel":"KS","license":"53-82601-052"},{"provider":"Lindsay  Burden","state":"KY","stateLabel":"KY","license":"3012713"},{"provider":"Lindsay  Burden","state":"ME","stateLabel":"ME","license":"CNP251606"},{"provider":"Lindsay  Burden","state":"MD","stateLabel":"MD","license":"AC008437"},{"provider":"Lindsay  Burden","state":"MI","stateLabel":"MI","license":"4704345834"},{"provider":"Lindsay  Burden","state":"MN","stateLabel":"MN","license":"12906"},{"provider":"Lindsay  Burden","state":"MT","stateLabel":"MT","license":"APRN-215905"},{"provider":"Lindsay  Burden","state":"NE","stateLabel":"NE","license":"115925"},{"provider":"Lindsay  Burden","state":"NV","stateLabel":"NV","license":"886855"},{"provider":"Lindsay  Burden","state":"NV","stateLabel":"NV CSR","license":"CS40047"},{"provider":"Lindsay  Burden","state":"NH","stateLabel":"NH","license":"112115-23"},{"provider":"Lindsay  Burden","state":"NJ","stateLabel":"NJ","license":"26NJ15040900"},{"provider":"Lindsay  Burden","state":"NJ","stateLabel":"NJ CSR","license":"CS40047"},{"provider":"Lindsay  Burden","state":"NM","stateLabel":"NM","license":"54172"},{"provider":"Lindsay  Burden","state":"NM","stateLabel":"NM CSR","license":"CS02325083"},{"provider":"Lindsay  Burden","state":"NY","stateLabel":"NY","license":"F343350-01"},{"provider":"Lindsay  Burden","state":"NC","stateLabel":"NC","license":"5010944"},{"provider":"Lindsay  Burden","state":"ND","stateLabel":"ND","license":"203298"},{"provider":"Lindsay  Burden","state":"OH","stateLabel":"OH","license":"APRN.CNP.0035270"},{"provider":"Lindsay  Burden","state":"OR","stateLabel":"OR","license":"10042381"},{"provider":"Lindsay  Burden","state":"PA","stateLabel":"PA","license":"SP030269"},{"provider":"Lindsay  Burden","state":"PA","stateLabel":"PA RX","license":"NPPA067561"},{"provider":"Lindsay  Burden","state":"SC","stateLabel":"SC","license":"28775"},{"provider":"Lindsay  Burden","state":"TN","stateLabel":"TN","license":"37771"},{"provider":"Lindsay  Burden","state":"TX","stateLabel":"TX","license":"AP138428"},{"provider":"Lindsay  Burden","state":"UT","stateLabel":"UT","license":"14221393-4405"},{"provider":"Lindsay  Burden","state":"UT","stateLabel":"UT CSR","license":"14221393-8900"},{"provider":"Lindsay  Burden","state":"VT","stateLabel":"VT","license":"101.0138375"},{"provider":"Lindsay  Burden","state":"VA","stateLabel":"VA","license":"0024176454"},{"provider":"Lindsay  Burden","state":"WA","stateLabel":"WA","license":"AP61500562"},{"provider":"Lindsay  Burden","state":"WI","stateLabel":"WI","license":"15214 - 33"},{"provider":"Lindsay  Burden","state":"WY","stateLabel":"WY","license":"58420"},{"provider":"Bill  Carbonneau","state":"AZ","stateLabel":"AZ","license":"308379"},{"provider":"Bill  Carbonneau","state":"CA","stateLabel":"CA","license":"95023652"},{"provider":"Bill  Carbonneau","state":"CA","stateLabel":"CA Furnishing","license":"95023652"},{"provider":"Bill  Carbonneau","state":"CO","stateLabel":"CO","license":"C-APN.0101985-C-NP"},{"provider":"Bill  Carbonneau","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0101733-C-NP"},{"provider":"Bill  Carbonneau","state":"FL","stateLabel":"FL","license":"APRN11007331"},{"provider":"Bill  Carbonneau","state":"ID","stateLabel":"ID","license":"1171163"},{"provider":"Bill  Carbonneau","state":"ID","stateLabel":"ID CSR","license":"3471362"},{"provider":"Bill  Carbonneau","state":"IL","stateLabel":"IL","license":"277.004990"},{"provider":"Bill  Carbonneau","state":"IL","stateLabel":"IL CSR","license":"377.004511"},{"provider":"Bill  Carbonneau","state":"IN","stateLabel":"IN","license":"71016854A"},{"provider":"Bill  Carbonneau","state":"IN","stateLabel":"IN CSR","license":"71016854B"},{"provider":"Bill  Carbonneau","state":"IA","stateLabel":"IA","license":"A184905"},{"provider":"Bill  Carbonneau","state":"IA","stateLabel":"IA CSR","license":"5209565"},{"provider":"Bill  Carbonneau","state":"KS","stateLabel":"KS","license":"83289"},{"provider":"Bill  Carbonneau","state":"ME","stateLabel":"ME","license":"CNP251789"},{"provider":"Bill  Carbonneau","state":"MD","stateLabel":"MD","license":"AC008142"},{"provider":"Bill  Carbonneau","state":"MD","stateLabel":"MD CSR","license":"N129637"},{"provider":"Bill  Carbonneau","state":"MA","stateLabel":"MA","license":"RN206199"},{"provider":"Bill  Carbonneau","state":"MA","stateLabel":"MA CSR","license":"MCS006588B"},{"provider":"Bill  Carbonneau","state":"MI","stateLabel":"MI","license":"4704430189"},{"provider":"Bill  Carbonneau","state":"MN","stateLabel":"MN","license":"13428"},{"provider":"Bill  Carbonneau","state":"MO","stateLabel":"MO","license":"2025003064"},{"provider":"Bill  Carbonneau","state":"MT","stateLabel":"MT","license":"NUR-APRN-LIC-262855"},{"provider":"Bill  Carbonneau","state":"NE","stateLabel":"NE","license":"116397"},{"provider":"Bill  Carbonneau","state":"NV","stateLabel":"NV","license":"876144"},{"provider":"Bill  Carbonneau","state":"NV","stateLabel":"NV CSR","license":"CS39217"},{"provider":"Bill  Carbonneau","state":"NH","stateLabel":"NH","license":"041866-23"},{"provider":"Bill  Carbonneau","state":"NJ","stateLabel":"NJ","license":"26NJ15221600"},{"provider":"Bill  Carbonneau","state":"NJ","stateLabel":"NJ CSR","license":"26NJ15221600"},{"provider":"Bill  Carbonneau","state":"NM","stateLabel":"NM","license":"84628"},{"provider":"Bill  Carbonneau","state":"NM","stateLabel":"NM CSR","license":"CS02327106"},{"provider":"Bill  Carbonneau","state":"NY","stateLabel":"NY","license":"351283"},{"provider":"Bill  Carbonneau","state":"NC","stateLabel":"NC","license":"5022301"},{"provider":"Bill  Carbonneau","state":"ND","stateLabel":"ND","license":"202963"},{"provider":"Bill  Carbonneau","state":"OH","stateLabel":"OH","license":"0039080"},{"provider":"Bill  Carbonneau","state":"OK","stateLabel":"OK","license":"219249"},{"provider":"Bill  Carbonneau","state":"OR","stateLabel":"OR","license":"10039507"},{"provider":"Bill  Carbonneau","state":"PA","stateLabel":"PA","license":"SP031829"},{"provider":"Bill  Carbonneau","state":"PA","stateLabel":"PA RX","license":"NPPA067568"},{"provider":"Bill  Carbonneau","state":"SD","stateLabel":"SD","license":"CP003975"},{"provider":"Bill  Carbonneau","state":"SD","stateLabel":"SD CSR","license":"SDCSR79973"},{"provider":"Bill  Carbonneau","state":"TX","stateLabel":"TX","license":"1099984"},{"provider":"Bill  Carbonneau","state":"UT","stateLabel":"UT","license":"14237761-4405"},{"provider":"Bill  Carbonneau","state":"UT","stateLabel":"UT CSR","license":"14237761-8900"},{"provider":"Bill  Carbonneau","state":"VT","stateLabel":"VT","license":"101.0138391"},{"provider":"Bill  Carbonneau","state":"VA","stateLabel":"VA","license":"0024193637"},{"provider":"Bill  Carbonneau","state":"WA","stateLabel":"WA","license":"AP61618269"},{"provider":"Bill  Carbonneau","state":"WV","stateLabel":"WV","license":"124573, pending P.A."},{"provider":"Bill  Carbonneau","state":"WI","stateLabel":"WI","license":"15925-33"},{"provider":"Summer  Denny","state":"AZ","stateLabel":"AZ","license":"292520"},{"provider":"Summer  Denny","state":"CA","stateLabel":"CA","license":"95024666"},{"provider":"Summer  Denny","state":"CA","stateLabel":"CA Furnishing","license":"95024666"},{"provider":"Summer  Denny","state":"CO","stateLabel":"CO","license":"APN.0994941-NP"},{"provider":"Summer  Denny","state":"CO","stateLabel":"CO APRN RX","license":"RXN.0104214-NP"},{"provider":"Summer  Denny","state":"FL","stateLabel":"FL","license":"APRN11031615"},{"provider":"Summer  Denny","state":"ID","stateLabel":"ID","license":"8471253"},{"provider":"Summer  Denny","state":"ID","stateLabel":"ID CSR","license":"4971959"},{"provider":"Summer  Denny","state":"KY","stateLabel":"KY","license":"3017649"},{"provider":"Summer  Denny","state":"MO","stateLabel":"MO","license":"2023010528"},{"provider":"Summer  Denny","state":"MT","stateLabel":"MT","license":"APRN-261761"},{"provider":"Summer  Denny","state":"NV","stateLabel":"NV","license":"811224"},{"provider":"Summer  Denny","state":"NV","stateLabel":"NV CSR","license":"CS40872"},{"provider":"Summer  Denny","state":"NM","stateLabel":"NM","license":"83445"},{"provider":"Summer  Denny","state":"NY","stateLabel":"NY","license":"351645"},{"provider":"Summer  Denny","state":"OH","stateLabel":"OH","license":"APRN.CNP.0041342"},{"provider":"Summer  Denny","state":"OR","stateLabel":"OR","license":"10017952"},{"provider":"Summer  Denny","state":"VA","stateLabel":"VA","license":"0024184742"},{"provider":"Summer  Denny","state":"WA","stateLabel":"WA","license":"AP61508792"},{"provider":"Victor  Lopez","state":"AL","stateLabel":"AL","license":"3-001000"},{"provider":"Victor  Lopez","state":"AZ","stateLabel":"AZ","license":"279357"},{"provider":"Victor  Lopez","state":"CA","stateLabel":"CA","license":"95005933"},{"provider":"Victor  Lopez","state":"CA","stateLabel":"CA Furnishing","license":"95005933"},{"provider":"Victor  Lopez","state":"CO","stateLabel":"CO","license":"C- APN.0004185- C-NP"},{"provider":"Victor  Lopez","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0002234-C-NP"},{"provider":"Victor  Lopez","state":"CT","stateLabel":"CT","license":"12.011082"},{"provider":"Victor  Lopez","state":"FL","stateLabel":"FL","license":"APRN9221773"},{"provider":"Victor  Lopez","state":"GA","stateLabel":"GA","license":"GAA-NP001546"},{"provider":"Victor  Lopez","state":"IL","stateLabel":"IL","license":"277005189"},{"provider":"Victor  Lopez","state":"IL","stateLabel":"IL CSR","license":"377.004660"},{"provider":"Victor  Lopez","state":"IN","stateLabel":"IN","license":"71013423A"},{"provider":"Victor  Lopez","state":"IA","stateLabel":"IA","license":"A180029"},{"provider":"Victor  Lopez","state":"KY","stateLabel":"KY","license":"3012099"},{"provider":"Victor  Lopez","state":"ME","stateLabel":"ME","license":"CNP251889"},{"provider":"Victor  Lopez","state":"MI","stateLabel":"MI","license":"4704394861"},{"provider":"Victor  Lopez","state":"MT","stateLabel":"MT","license":"NUR-APRN-LIC-262513"},{"provider":"Victor  Lopez","state":"NJ","stateLabel":"NJ","license":"26NJ14846900"},{"provider":"Victor  Lopez","state":"NJ","stateLabel":"NJ CSR","license":"P01569300"},{"provider":"Victor  Lopez","state":"NM","stateLabel":"NM","license":"82819"},{"provider":"Victor  Lopez","state":"NY","stateLabel":"NY","license":"350846"},{"provider":"Victor  Lopez","state":"NC","stateLabel":"NC","license":"5010300"},{"provider":"Victor  Lopez","state":"OH","stateLabel":"OH","license":"APRN.CNP.0032135"},{"provider":"Victor  Lopez","state":"OR","stateLabel":"OR","license":"201809649NP-PP"},{"provider":"Victor  Lopez","state":"PA","stateLabel":"PA","license":"SP027418"},{"provider":"Victor  Lopez","state":"PA","stateLabel":"PA RX","license":"NPPA058951"},{"provider":"Victor  Lopez","state":"TN","stateLabel":"TN","license":"31931"},{"provider":"Victor  Lopez","state":"TX","stateLabel":"TX","license":"AP136697"},{"provider":"Victor  Lopez","state":"VA","stateLabel":"VA","license":"0024184841"},{"provider":"Victor  Lopez","state":"WA","stateLabel":"WA","license":"AP61379443"},{"provider":"Victor  Lopez","state":"WI","stateLabel":"WI","license":"13752-33"},{"provider":"Martin Van Dongen","state":"FL","stateLabel":"FL","license":"APRN11010061"},{"provider":"Martin Van Dongen","state":"ID","stateLabel":"ID","license":"4871956"},{"provider":"Martin Van Dongen","state":"ID","stateLabel":"ID CSR","license":"2571162"},{"provider":"Martin Van Dongen","state":"IL","stateLabel":"IL","license":"277.005058"},{"provider":"Martin Van Dongen","state":"IL","stateLabel":"IL CSR","license":"377.004555"},{"provider":"Martin Van Dongen","state":"IN","stateLabel":"IN","license":"71017424A"},{"provider":"Martin Van Dongen","state":"IN","stateLabel":"IN CSR","license":"71017424B"},{"provider":"Martin Van Dongen","state":"MI","stateLabel":"MI","license":"4704409759"},{"provider":"Martin Van Dongen","state":"MN","stateLabel":"MN","license":"13029"},{"provider":"Martin Van Dongen","state":"MT","stateLabel":"MT","license":"NUR-APRN-LIC-225963"},{"provider":"Martin Van Dongen","state":"NJ","stateLabel":"NJ","license":"26NJ15330000"},{"provider":"Martin Van Dongen","state":"NJ","stateLabel":"NJ CSR","license":"P01664500"},{"provider":"Martin Van Dongen","state":"NC","stateLabel":"NC","license":"5019322"},{"provider":"Martin Van Dongen","state":"OH","stateLabel":"OH","license":"APRN.CNP.0035949"},{"provider":"Martin Van Dongen","state":"PA","stateLabel":"PA","license":"SP031943"},{"provider":"Martin Van Dongen","state":"PA","stateLabel":"PA RX","license":"NPPA067293"},{"provider":"Martin Van Dongen","state":"UT","stateLabel":"UT","license":"14260595-4405"},{"provider":"Martin Van Dongen","state":"UT","stateLabel":"UT CSR","license":"14260595-8900"},{"provider":"Martin Van Dongen","state":"VA","stateLabel":"VA","license":"0024188706"},{"provider":"Martin Van Dongen","state":"WA","stateLabel":"WA","license":"AP61638539"},{"provider":"Martin Van Dongen","state":"WV","stateLabel":"WV","license":"124625, pending PA"},{"provider":"Martin Van Dongen","state":"WI","stateLabel":"WI","license":"17528-33"},{"provider":"Tim  Mack","state":"AZ","stateLabel":"AZ","license":"303525"},{"provider":"Tim  Mack","state":"CA","stateLabel":"CA","license":"95024098"},{"provider":"Tim  Mack","state":"CA","stateLabel":"CA Furnishing","license":"95024098"},{"provider":"Tim  Mack","state":"CO","stateLabel":"CO","license":"C-APN.0100574-C-NP"},{"provider":"Tim  Mack","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0101535-C-NP"},{"provider":"Tim  Mack","state":"IL","stateLabel":"IL","license":"277.005086"},{"provider":"Tim  Mack","state":"IL","stateLabel":"IL CSR","license":"377.004577"},{"provider":"Tim  Mack","state":"IA","stateLabel":"IA","license":"A184329"},{"provider":"Tim  Mack","state":"IA","stateLabel":"IA CSR","license":"5209417"},{"provider":"Tim  Mack","state":"NE","stateLabel":"NE","license":"116142"},{"provider":"Tim  Mack","state":"NM","stateLabel":"NM","license":"77764"},{"provider":"Tim  Mack","state":"NM","stateLabel":"NM CSR","license":"CS02325427"},{"provider":"Tim  Mack","state":"ND","stateLabel":"ND","license":"203010"},{"provider":"Tim  Mack","state":"OR","stateLabel":"OR","license":"10014831"},{"provider":"Tim  Mack","state":"TX","stateLabel":"TX","license":"AP142417"},{"provider":"Tim  Mack","state":"VT","stateLabel":"VT","license":"101.0138376"},{"provider":"Bryana  Anderson","state":"AR","stateLabel":"AR","license":"A005900"},{"provider":"Bryana  Anderson","state":"CA","stateLabel":"CA","license":"95011611"},{"provider":"Bryana  Anderson","state":"CA","stateLabel":"CA Furnishing","license":"95011611"},{"provider":"Bryana  Anderson","state":"ID","stateLabel":"ID","license":"7971946"},{"provider":"Bryana  Anderson","state":"ID","stateLabel":"ID CSR","license":"8671354"},{"provider":"Bryana  Anderson","state":"IL","stateLabel":"IL","license":"209019514"},{"provider":"Bryana  Anderson","state":"IN","stateLabel":"IN","license":"71016089A"},{"provider":"Bryana  Anderson","state":"IN","stateLabel":"IN CSR","license":"71016089B"},{"provider":"Bryana  Anderson","state":"IA","stateLabel":"IA","license":"A151648"},{"provider":"Bryana  Anderson","state":"IA","stateLabel":"IA CSR","license":"5209079"},{"provider":"Bryana  Anderson","state":"LA","stateLabel":"LA","license":"207495"},{"provider":"Bryana  Anderson","state":"MI","stateLabel":"MI","license":"4704425613"},{"provider":"Bryana  Anderson","state":"NE","stateLabel":"NE","license":"112903"},{"provider":"Bryana  Anderson","state":"NM","stateLabel":"NM","license":"56614"},{"provider":"Bryana  Anderson","state":"NY","stateLabel":"NY","license":"3454186"},{"provider":"Bryana  Anderson","state":"OK","stateLabel":"OK","license":"M0130537"},{"provider":"Bryana  Anderson","state":"TX","stateLabel":"TX","license":"AP129777"},{"provider":"Priya  Chaudhari","state":"AZ","stateLabel":"AZ","license":"323875"},{"provider":"Priya  Chaudhari","state":"FL","stateLabel":"FL","license":"APRN11034354"},{"provider":"Priya  Chaudhari","state":"ID","stateLabel":"ID","license":"3661378"},{"provider":"Priya  Chaudhari","state":"ID","stateLabel":"ID CSR","license":"5961972"},{"provider":"Priya  Chaudhari","state":"IL","stateLabel":"IL","license":"209023113"},{"provider":"Priya  Chaudhari","state":"IL","stateLabel":"IL CSR","license":"309022861"},{"provider":"Priya  Chaudhari","state":"MO","stateLabel":"MO","license":"2016042113"},{"provider":"Priya  Chaudhari","state":"OH","stateLabel":"OH","license":"APRN.CNP.0037657"},{"provider":"Priya  Chaudhari","state":"WI","stateLabel":"WI","license":"17341-33"},{"provider":"Terray Humphrey","state":"CA","stateLabel":"CA","license":"95007584"},{"provider":"Terray Humphrey","state":"CA","stateLabel":"CA Furnishing","license":"95007584"},{"provider":"Terray Humphrey","state":"FL","stateLabel":"FL","license":"APRN11043780"},{"provider":"Terray Humphrey","state":"GA","stateLabel":"GA","license":"RN318848"},{"provider":"Terray Humphrey","state":"MI","stateLabel":"MI","license":"4704433696"},{"provider":"Terray Humphrey","state":"NY","stateLabel":"NY","license":"356123"},{"provider":"Terray Humphrey","state":"NC","stateLabel":"NC","license":"5023395"},{"provider":"Terray Humphrey","state":"OH","stateLabel":"OH","license":"APRN.CNP.0040198"},{"provider":"Terray Humphrey","state":"TX","stateLabel":"TX","license":"1195472"},{"provider":"Terray Humphrey","state":"UT","stateLabel":"UT","license":"14222569-4405"},{"provider":"Terray Humphrey","state":"UT","stateLabel":"UT CSR","license":"14222569-8900"},{"provider":"Terray Humphrey","state":"VA","stateLabel":"VA","license":"0024194879"},{"provider":"Vivien Lee","state":"CA","stateLabel":"CA","license":"95024568"},{"provider":"Vivien Lee","state":"CA","stateLabel":"CA Furnishing","license":"95024568"},{"provider":"Vivien Lee","state":"CO","stateLabel":"CO","license":"APN.1001233-NP"},{"provider":"Vivien Lee","state":"CO","stateLabel":"CO APRN RX","license":"RXN.0110148-NP"},{"provider":"Vivien Lee","state":"ND","stateLabel":"ND","license":"203166"},{"provider":"Liz Gloor","state":"FL","stateLabel":"FL","license":"APRN11041470"},{"provider":"Liz Gloor","state":"IA","stateLabel":"IA","license":"A184077"},{"provider":"Liz Gloor","state":"IA","stateLabel":"IA CSR","license":"5209368"},{"provider":"Liz Gloor","state":"MD","stateLabel":"MD","license":"R248492"},{"provider":"Liz Gloor","state":"MD","stateLabel":"MD CSR","license":"N114009"},{"provider":"Liz Gloor","state":"NV","stateLabel":"NV","license":"889955"},{"provider":"Liz Gloor","state":"NV","stateLabel":"NV CSR","license":"CS41587"},{"provider":"Liz Gloor","state":"NC","stateLabel":"NC","license":"5023532"},{"provider":"Liz Gloor","state":"VA","stateLabel":"VA","license":"0024184007"},{"provider":"Bryce Amos","state":"DC","stateLabel":"DC","license":"NP500023247"},{"provider":"Bryce Amos","state":"FL","stateLabel":"FL","license":"APRN11013874"},{"provider":"Bryce Amos","state":"NY","stateLabel":"NY","license":"356557"},{"provider":"Bryce Amos","state":"OH","stateLabel":"OH","license":"APRN.CNP.0038398"},{"provider":"Catherine Herrington ( MD)","state":"CA","stateLabel":"CA","license":"A157072"},{"provider":"Catherine Herrington ( MD)","state":"FL","stateLabel":"FL","license":"ME162177"},{"provider":"Catherine Herrington ( MD)","state":"KY","stateLabel":"KY","license":"61427"},{"provider":"Catherine Herrington ( MD)","state":"PA","stateLabel":"PA","license":"MD491399"},{"provider":"Catherine Herrington ( MD)","state":"TX","stateLabel":"TX","license":"R8011"},{"provider":"Alexis Foster-Horton","state":"AZ","stateLabel":"AZ","license":"290134"},{"provider":"Alexis Foster-Horton","state":"KS","stateLabel":"KS","license":"53-81181-012"},{"provider":"Alexis Foster-Horton","state":"MN","stateLabel":"MN","license":"RN"},{"provider":"Alexis Foster-Horton","state":"MO","stateLabel":"MO","license":"2022017352"},{"provider":"Alexis Foster-Horton","state":"OH","stateLabel":"OH","license":"APRN.CNP.0041498"},{"provider":"Alexis Foster-Horton","state":"TX","stateLabel":"TX","license":"1167866"},{"provider":"Alexis Foster-Horton","state":"VA","stateLabel":"VA","license":"0024196387"},{"provider":"Rachel Razi","state":"CA","stateLabel":"CA","license":"95031528"},{"provider":"Rachel Razi","state":"CA","stateLabel":"CA Furnishing","license":"95031528"},{"provider":"Rachel Razi","state":"SD","stateLabel":"SD","license":"RN active, pending NP"},{"provider":"Megan Ryan-Riffle","state":"MD","stateLabel":"MD","license":"R211398"},{"provider":"Megan Ryan-Riffle","state":"MD","stateLabel":"MD CSR","license":"N104190"},{"provider":"Megan Ryan-Riffle","state":"PA","stateLabel":"PA","license":"SP023597"},{"provider":"Megan Ryan-Riffle","state":"PA","stateLabel":"PA RX","license":"NPPA044903"},{"provider":"Megan Ryan-Riffle","state":"VA","stateLabel":"VA","license":"0024184652"},{"provider":"Ashley Grout","state":"AZ","stateLabel":"AZ","license":"APRN-RNP 331782"},{"provider":"Ashley Grout","state":"FL","stateLabel":"FL","license":"APRN9361181"},{"provider":"Ashley Grout","state":"GA","stateLabel":"GA","license":"GAA-NP003747"},{"provider":"Ashley Grout","state":"NY","stateLabel":"NY","license":"358210"},{"provider":"Ashley Grout","state":"TX","stateLabel":"TX","license":"1222146"},{"provider":"Jacquelyn  Sexton","state":"CA","stateLabel":"CA","license":"95038464"},{"provider":"Jacquelyn  Sexton","state":"CA","stateLabel":"CA Furnishing","license":"95038464"},{"provider":"Jacquelyn  Sexton","state":"CO","stateLabel":"CO","license":"C-APN.0104548-C-NP"},{"provider":"Jacquelyn  Sexton","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0103199-C-NP"},{"provider":"Jacquelyn  Sexton","state":"FL","stateLabel":"FL","license":"APRN11009414"},{"provider":"Jacquelyn  Sexton","state":"NJ","stateLabel":"NJ","license":"26NJ15426500"},{"provider":"Jacquelyn  Sexton","state":"NJ","stateLabel":"NJ CSR","license":"P01718300"},{"provider":"Jacquelyn  Sexton","state":"OH","stateLabel":"OH","license":"APRN.CNP.0041248"},{"provider":"Jacquelyn  Sexton","state":"VA","stateLabel":"VA","license":"0024193949"},{"provider":"Michele  Foster","state":"ME","stateLabel":"ME","license":"CNP251906"},{"provider":"Michele  Foster","state":"MN","stateLabel":"MN","license":"13846"},{"provider":"Michele  Foster","state":"MT","stateLabel":"MT","license":"NUR-APRN-LIC-268860"},{"provider":"Michele  Foster","state":"OR","stateLabel":"OR","license":"10055987"},{"provider":"Michele  Foster","state":"TX","stateLabel":"TX","license":"1068368"},{"provider":"Michele  Foster","state":"WA","stateLabel":"WA","license":"AP70083320"},{"provider":"Danielle  Board","state":"CO","stateLabel":"CO","license":"C-APN.0102476-C-NP"},{"provider":"Danielle  Board","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0103090-C-NP"},{"provider":"Danielle  Board","state":"IL","stateLabel":"IL","license":"277.0049.35"},{"provider":"Danielle  Board","state":"IL","stateLabel":"IL CSR","license":"377.004472"},{"provider":"Danielle  Board","state":"IN","stateLabel":"IN","license":"71012692A"},{"provider":"Danielle  Board","state":"IN","stateLabel":"IN CSR","license":"71012692B"},{"provider":"Danielle  Board","state":"KY","stateLabel":"KY","license":"3016496"},{"provider":"Danielle  Board","state":"NY","stateLabel":"NY","license":"356498"},{"provider":"DeAnna  Maher","state":"AZ","stateLabel":"AZ","license":"330943"},{"provider":"DeAnna  Maher","state":"CA","stateLabel":"CA","license":"95037281"},{"provider":"DeAnna  Maher","state":"CA","stateLabel":"CA Furnishing","license":"95037281"},{"provider":"DeAnna  Maher","state":"CO","stateLabel":"CO","license":"C-APN.0101880-C-NP"},{"provider":"DeAnna  Maher","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.0103333-C-NP"},{"provider":"DeAnna  Maher","state":"FL","stateLabel":"FL","license":"APRN11041956"},{"provider":"DeAnna  Maher","state":"NY","stateLabel":"NY","license":"358117"},{"provider":"DeAnna  Maher","state":"TX","stateLabel":"TX","license":"1142760"},{"provider":"Ashley  Escoe","state":"AK","stateLabel":"AK","license":"171277"},{"provider":"Ashley  Escoe","state":"AZ","stateLabel":"AZ","license":"260966"},{"provider":"Ashley  Escoe","state":"AR","stateLabel":"AR","license":"214852"},{"provider":"Ashley  Escoe","state":"CA","stateLabel":"CA","license":"95015909"},{"provider":"Ashley  Escoe","state":"CA","stateLabel":"CA Furnishing","license":"95015909"},{"provider":"Ashley  Escoe","state":"CO","stateLabel":"CO","license":"C-APN.0003002-C-NP"},{"provider":"Ashley  Escoe","state":"CO","stateLabel":"CO APRN RX","license":"C-RXN.001492-C-NP"},{"provider":"Ashley  Escoe","state":"CT","stateLabel":"CT","license":"12767"},{"provider":"Ashley  Escoe","state":"DC","stateLabel":"DC","license":"NP1062264"},{"provider":"Ashley  Escoe","state":"DE","stateLabel":"DE","license":"LG-0011581"},{"provider":"Ashley  Escoe","state":"FL","stateLabel":"FL","license":"APRN11012374"},{"provider":"Ashley  Escoe","state":"GA","stateLabel":"GA","license":"GAA-NP000488"},{"provider":"Ashley  Escoe","state":"HI","stateLabel":"HI","license":"103642"},{"provider":"Ashley  Escoe","state":"ID","stateLabel":"ID","license":"67550"},{"provider":"Ashley  Escoe","state":"IL","stateLabel":"IL","license":"277002432"},{"provider":"Ashley  Escoe","state":"IL","stateLabel":"IL CSR","license":"377002340"},{"provider":"Ashley  Escoe","state":"IN","stateLabel":"IN","license":"71015961A"},{"provider":"Ashley  Escoe","state":"IN","stateLabel":"IN CSR","license":"71015961B"},{"provider":"Ashley  Escoe","state":"IA","stateLabel":"IA","license":"A162786"},{"provider":"Ashley  Escoe","state":"IA","stateLabel":"IA CSR","license":"5210063"},{"provider":"Ashley  Escoe","state":"KS","stateLabel":"KS","license":"53-79949-111"},{"provider":"Ashley  Escoe","state":"KY","stateLabel":"KY","license":"3015723"},{"provider":"Ashley  Escoe","state":"LA","stateLabel":"LA","license":"215619"},{"provider":"Ashley  Escoe","state":"ME","stateLabel":"ME","license":"CNP211012"},{"provider":"Ashley  Escoe","state":"MD","stateLabel":"MD","license":"AC003557"},{"provider":"Ashley  Escoe","state":"MA","stateLabel":"MA","license":"RN2349569"},{"provider":"Ashley  Escoe","state":"MA","stateLabel":"MA CSR","license":"MCS009368B"},{"provider":"Ashley  Escoe","state":"MI","stateLabel":"MI","license":"4704371398"},{"provider":"Ashley  Escoe","state":"MN","stateLabel":"MN","license":"10707"},{"provider":"Ashley  Escoe","state":"MO","stateLabel":"MO","license":"2021001537"},{"provider":"Ashley  Escoe","state":"MT","stateLabel":"MT","license":"APRN-174669"},{"provider":"Ashley  Escoe","state":"NE","stateLabel":"NE","license":"113450"},{"provider":"Ashley  Escoe","state":"NV","stateLabel":"NV","license":"820726"},{"provider":"Ashley  Escoe","state":"NV","stateLabel":"NV CSR","license":"CS41620"},{"provider":"Ashley  Escoe","state":"NH","stateLabel":"NH","license":"084878-23"},{"provider":"Ashley  Escoe","state":"NJ","stateLabel":"NJ","license":"26NJ14979900"},{"provider":"Ashley  Escoe","state":"NJ","stateLabel":"NJ CSR","license":"P01751400"},{"provider":"Ashley  Escoe","state":"NM","stateLabel":"NM","license":"62279"},{"provider":"Ashley  Escoe","state":"NM","stateLabel":"NM CSR","license":"CS02327811"},{"provider":"Ashley  Escoe","state":"NY","stateLabel":"NY","license":"348977"},{"provider":"Ashley  Escoe","state":"NC","stateLabel":"NC","license":"5017632"},{"provider":"Ashley  Escoe","state":"OH","stateLabel":"OH","license":"0030269"},{"provider":"Ashley  Escoe","state":"OK","stateLabel":"OK","license":"206719"},{"provider":"Ashley  Escoe","state":"OR","stateLabel":"OR","license":"202105810NP-PP"},{"provider":"Ashley  Escoe","state":"PA","stateLabel":"PA","license":"SP0031890"},{"provider":"Ashley  Escoe","state":"RI","stateLabel":"RI","license":"APRN03308"},{"provider":"Ashley  Escoe","state":"SD","stateLabel":"SD","license":"CP002034"},{"provider":"Ashley  Escoe","state":"SD","stateLabel":"SD CSR","license":"80077"},{"provider":"Ashley  Escoe","state":"TN","stateLabel":"TN","license":"32255"},{"provider":"Ashley  Escoe","state":"TX","stateLabel":"TX","license":"AP143953"},{"provider":"Ashley  Escoe","state":"UT","stateLabel":"UT","license":"12086444-4405"},{"provider":"Ashley  Escoe","state":"VT","stateLabel":"VT","license":"101.0134741"},{"provider":"Ashley  Escoe","state":"VA","stateLabel":"VA","license":"0024180729"},{"provider":"Ashley  Escoe","state":"WA","stateLabel":"WA","license":"AP61134920"},{"provider":"Ashley  Escoe","state":"WV","stateLabel":"WV","license":"108348"},{"provider":"Ashley  Escoe","state":"WY","stateLabel":"WY","license":"47799"},{"provider":"Skye  Sauls","state":"FL","stateLabel":"FL","license":"APRN11025749"},{"provider":"Skye  Sauls","state":"NV","stateLabel":"NV","license":"867026"},{"provider":"Skye  Sauls","state":"NV","stateLabel":"NV CSR","license":"CS36427"},{"provider":"Skye  Sauls","state":"NM","stateLabel":"NM","license":"87537"},{"provider":"Skye  Sauls","state":"NM","stateLabel":"NM CSR","license":"CS02327860"},{"provider":"Skye  Sauls","state":"OH","stateLabel":"OH","license":"0040946"},{"provider":"Skye  Sauls","state":"VA","stateLabel":"VA","license":"0024195898"}];

// ── Constants ─────────────────────────────────────────────────────────────────
const FIPS_TO_STATE = {"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY"};
const STATE_NAMES = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","DC":"Dist. of Columbia","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};
const ALL_STATES = Object.keys(STATE_NAMES).sort((a,b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]));
const ALL_PROVIDERS = [...new Set(RAW_RECORDS.map(r => r.provider))].sort();

// ── State operating status ────────────────────────────────────────────────────
// 30 Available states — open and accepting new patients
const ACTIVE_STATES = new Set([
  "AZ","CA","CO","FL","ID","IL","IN","IA","ME","MD","MI","MN","MT",
  "NE","NV","NJ","NM","NY","NC","ND","OH","OR","PA","SD","TX","UT",
  "VT","VA","WA","WI"
]);
// 21 Inactive states (muted blue-grey)
const INACTIVE_STATES = new Set([
  "AL","AK","AR","DE","DC","GA","HI","KS","KY","LA","MA","MS","MO","NH","OK","RI","SC","TN","WV","WY","CT"
]);
// Not open to new patients — amber (subset of inactive)
const NOT_OPEN_STATES = new Set(["TN","CT","MO"]);

// Normalise provider name display
const cleanName = n => n.replace(/\s+/g, ' ').trim();

// ── Topojson decoder ──────────────────────────────────────────────────────────
function decodeTopo(topology, object) {
  const { arcs: topoArcs, transform } = topology;
  const scale = transform ? transform.scale : [1,1];
  const translate = transform ? transform.translate : [0,0];
  function decodeArc(i) {
    const arc = topoArcs[i < 0 ? ~i : i];
    let x=0,y=0;
    const pts = arc.map(([dx,dy]) => { x+=dx; y+=dy; return [x*scale[0]+translate[0], y*scale[1]+translate[1]]; });
    return i<0 ? pts.reverse() : pts;
  }
  function ringCoords(ring) { return ring.flatMap(i => decodeArc(i)); }
  function toGeoJSON(geom) {
    if (geom.type==="Polygon") return {type:"Polygon", coordinates:geom.arcs.map(ringCoords)};
    if (geom.type==="MultiPolygon") return {type:"MultiPolygon", coordinates:geom.arcs.map(p=>p.map(ringCoords))};
    return null;
  }
  return { type:"FeatureCollection", features: object.geometries.map(g => ({type:"Feature",id:g.id,properties:g.properties||{},geometry:toGeoJSON(g)})) };
}

// ── Colour palette for providers ─────────────────────────────────────────────
const PROVIDER_COLORS = [
  "#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#ec4899","#84cc16","#14b8a6",
  "#6366f1","#fbbf24","#e11d48","#22d3ee","#a3e635",
  "#7c3aed","#fb923c","#0ea5e9","#d946ef","#4ade80",
  "#f43f5e","#38bdf8","#facc15","#34d399","#c084fc",
];
const providerColor = (name) => PROVIDER_COLORS[ALL_PROVIDERS.indexOf(name) % PROVIDER_COLORS.length];

// ── Multi-select dropdown ─────────────────────────────────────────────────────
function MultiSelect({ label, options, selected, onChange, renderOption }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const toggle = v => onChange(selected.includes(v) ? selected.filter(x=>x!==v) : [...selected, v]);
  const allSelected = selected.length === options.length;
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={() => setOpen(!open)} style={{
        background:"#1e2535", border:"1px solid #2d3652", borderRadius:6,
        color:"#e2e8f0", padding:"7px 12px", fontSize:13, cursor:"pointer",
        display:"flex", alignItems:"center", gap:8, minWidth:180, justifyContent:"space-between",
        outline:"none",
      }}>
        <span style={{color: selected.length===0?"#4b5568":"#e2e8f0"}}>
          {selected.length===0 ? `All ${label}` : selected.length===1 ? (renderOption ? renderOption(selected[0]) : selected[0]) : `${selected.length} ${label} selected`}
        </span>
        <span style={{fontSize:10, color:"#6b7280"}}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:100,
          background:"#1a2234", border:"1px solid #2d3652", borderRadius:8,
          minWidth:240, maxHeight:320, overflowY:"auto", boxShadow:"0 8px 32px #00000066",
        }}>
          {/* Clear / Select all */}
          <div style={{display:"flex", gap:0, borderBottom:"1px solid #1e2b42"}}>
            <button onClick={()=>onChange(allSelected?[]:options)} style={{flex:1, background:"none",border:"none",padding:"8px 12px",fontSize:11,color:"#6b7280",cursor:"pointer",textAlign:"left",textTransform:"uppercase",letterSpacing:"0.08em"}}>
              {allSelected ? "Clear all" : "Select all"}
            </button>
            {selected.length>0 && <button onClick={()=>onChange([])} style={{background:"none",border:"none",padding:"8px 12px",fontSize:11,color:"#ef4444",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>Clear</button>}
          </div>
          {options.map(opt => (
            <div key={opt} onClick={()=>toggle(opt)} style={{
              padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10,
              background: selected.includes(opt) ? "#0d1830" : "transparent",
              borderLeft: selected.includes(opt) ? `2px solid ${renderOption ? providerColor(opt) : "#10b981"}` : "2px solid transparent",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#0d1830"}
              onMouseLeave={e=>e.currentTarget.style.background=selected.includes(opt)?"#0d1830":"transparent"}
            >
              <div style={{
                width:14,height:14,borderRadius:3,border:`1px solid ${selected.includes(opt)?"#10b981":"#374151"}`,
                background:selected.includes(opt)?"#10b981":"transparent",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#000",
              }}>{selected.includes(opt)?"✓":""}</div>
              {renderOption
                ? <span style={{fontSize:13,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:2,background:providerColor(opt),display:"inline-block",flexShrink:0}}/>
                    {cleanName(opt)}
                  </span>
                : <span style={{fontSize:13,color:"#e2e8f0"}}>{STATE_NAMES[opt]||opt} <span style={{color:"#4b5568",fontSize:11}}>({opt})</span></span>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function ProviderAuthorityMap() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const [clickedState, setClickedState] = useState(null);

  // Filters
  const [providerFilter, setProviderFilter] = useState([]); // empty = all
  const [stateFilter, setStateFilter] = useState([]);       // empty = all

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(r=>r.json())
      .then(topo => { setGeoData(decodeTopo(topo, topo.objects.states)); setLoading(false); })
      .catch(()=>setLoading(false));
  }, []);

  // Filtered records
  const filtered = useMemo(() => {
    let r = RAW_RECORDS;
    if (providerFilter.length>0) r = r.filter(rec => providerFilter.includes(rec.provider));
    return r;
  }, [providerFilter]);

  // stateMap: state → records[]
  const stateMap = useMemo(() => {
    const m = {};
    filtered.forEach(r => { if (!m[r.state]) m[r.state]=[]; m[r.state].push(r); });
    return m;
  }, [filtered]);

  // Stats (dynamic with filters)
  const stats = useMemo(() => {
    const providersShown = [...new Set(filtered.map(r => r.provider))].length;
    const statesCovered = [...new Set(filtered.map(r => r.state))].length;
    const totalLicenses = filtered.length;
    return { providersShown, statesCovered, totalLicenses };
  }, [filtered]);

  // Providers in selected states (for summary)
  const providersInSelectedStates = useMemo(() => {
    if (stateFilter.length===0) return [];
    const recs = filtered.filter(r => stateFilter.includes(r.state));
    return [...new Set(recs.map(r=>r.provider))];
  }, [filtered, stateFilter]);

  const W=960, H=560;
  const projection = useMemo(()=>d3.geoAlbersUsa().scale(1150).translate([W/2,H/2+20]),[]);
  const pathGen = useMemo(()=>d3.geoPath().projection(projection),[projection]);

  // Color logic
  const getStateFill = (st) => {
    const dimmed = stateFilter.length>0 && !stateFilter.includes(st);

    // Inactive (21 states) — muted blue-grey; TN, CT, MO get amber
    if (INACTIVE_STATES.has(st)) {
      if (NOT_OPEN_STATES.has(st)) {
        return { fill:"#2d1a06", stroke:"#d97706", opacity: dimmed?0.15:1, restricted:true };
      }
      return { fill:"#0f1a2e", stroke:"#2a4a6e", opacity: dimmed?0.15:0.85, inactive:true };
    }

    // Active states
    const recs = stateMap[st];
    if (!recs || recs.length===0) {
      return { fill:"#1a2234", stroke:"#2a3550", opacity: dimmed?0.15:0.7 };
    }
    const uniqueProviders = [...new Set(recs.map(r=>r.provider))];
    if (uniqueProviders.length===1) {
      const c = providerColor(uniqueProviders[0]);
      return { fill: c+"33", stroke: c, opacity: dimmed?0.15:1 };
    }
    const count = uniqueProviders.length;
    const fills = ["#0a2d1a","#0a3326","#0d4030","#0d5038","#0a6040"];
    const strokes = ["#059669","#10b981","#34d399","#6ee7b7","#a7f3d0"];
    const idx = Math.min(count-1, fills.length-1);
    return { fill: fills[idx], stroke: strokes[idx], opacity: dimmed?0.15:1 };
  };

  const clickedRecs = clickedState ? (stateMap[clickedState]||[]) : [];
  const displayedClickedRecs = providerFilter.length>0 ? clickedRecs : clickedRecs;

  const labelSt = {fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.1em"};

  return (
    <div style={{fontFamily:"'DM Mono','Courier New',monospace",background:"#111827",minHeight:"100vh",color:"#e2e8f0",padding:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#1e2535}
        ::-webkit-scrollbar-thumb{background:#374151;border-radius:2px}
        .geo-path{transition:opacity 0.15s;}
        .geo-path:hover{filter:brightness(1.4);}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,letterSpacing:"0.2em",color:"#4b5563",textTransform:"uppercase",marginBottom:4}}>Fountain Clinical Operations</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,margin:0,color:"#f9fafb",letterSpacing:"-0.02em"}}>Provider Authority Map</h1>
        <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>
          {ALL_PROVIDERS.length} providers · {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20,maxWidth:500}}>
        {[
          {label:"Providers Shown", value: stats.providersShown, color:"#94a3b8"},
          {label:"States Covered", value: stats.statesCovered, color:"#10b981"},
          {label:"Total Licenses", value: stats.totalLicenses, color:"#94a3b8"},
        ].map(s=>(
          <div key={s.label} style={{background:"#1a2234",border:"1px solid #1e2b42",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:22,fontWeight:500,color:s.color,fontFamily:"'Syne',sans-serif"}}>{s.value}</div>
            <div style={{fontSize:10,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <label style={labelSt}>Providers</label>
          <MultiSelect
            label="providers"
            options={ALL_PROVIDERS}
            selected={providerFilter}
            onChange={setProviderFilter}
            renderOption={p => cleanName(p)}
          />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <label style={labelSt}>States</label>
          <MultiSelect
            label="states"
            options={ALL_STATES}
            selected={stateFilter}
            onChange={setStateFilter}
          />
        </div>
        {(providerFilter.length>0||stateFilter.length>0) && (
          <button onClick={()=>{setProviderFilter([]);setStateFilter([]);setClickedState(null);}} style={{
            background:"none",border:"1px solid #374151",borderRadius:6,color:"#6b7280",
            padding:"7px 12px",fontSize:12,cursor:"pointer",
          }}>✕ Clear filters</button>
        )}
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        {ALL_PROVIDERS.map(p=>{
          const isActive = providerFilter.includes(p);
          const c = providerColor(p);
          return (
            <div
              key={p}
              onClick={()=>{
                setProviderFilter(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);
                setClickedState(null);
              }}
              title={`Click to ${isActive?"remove":"add"} filter`}
              style={{
                display:"flex",alignItems:"center",gap:5,fontSize:11,cursor:"pointer",
                color: isActive ? "#f9fafb" : "#6b7280",
                background: isActive ? c+"22" : "#1a2234",
                border: `1px solid ${isActive ? c : "#1e2b42"}`,
                borderRadius:4,padding:"3px 8px",
                transition:"all 0.15s",
                outline: isActive ? `1px solid ${c}44` : "none",
              }}
            >
              <div style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0,opacity:isActive?1:0.5}}/>
              {cleanName(p)}
              {isActive && <span style={{color:c,fontSize:9,marginLeft:2}}>✕</span>}
            </div>
          );
        })}

        {/* Coming soon chip */}
        {(()=>{
          const isActive = stateFilter.length===3 && ["TN","CT","MO"].every(s=>stateFilter.includes(s));
          return (
            <div
              onClick={()=>{
                setStateFilter(isActive ? [] : ["TN","CT","MO"]);
                setProviderFilter([]);
                setClickedState(null);
              }}
              title="Click to highlight restricted states"
              style={{
                display:"flex",alignItems:"center",gap:5,fontSize:11,cursor:"pointer",
                color:"#d97706",
                background: isActive ? "#2d1a0a" : "#1f1506",
                border:`1px solid ${isActive?"#d97706":"#d9770644"}`,
                borderRadius:4,padding:"3px 8px",marginLeft:4,
                transition:"all 0.15s",
              }}
            >
              <span>⚠</span> Not open to new patients (TN, CT, MO)
              {isActive && <span style={{fontSize:9,marginLeft:2}}>✕</span>}
            </div>
          );
        })()}

        {/* Active chip */}
        <div
          title="States where Fountain is actively accepting patients"
          style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#10b981",background:"#0a2d1a",border:"1px solid #10b98144",borderRadius:4,padding:"3px 8px",cursor:"default"}}>
          <div style={{width:10,height:10,borderRadius:2,background:"#10b981",border:"1px solid #10b981",flexShrink:0}}/>
          Active
        </div>

        {/* Inactive chip */}
        <div
          title="States where Fountain is not yet operating"
          style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#60a5fa",background:"#0c1829",border:"1px solid #2a4a6e",borderRadius:4,padding:"3px 8px",cursor:"default"}}>
          <div style={{width:10,height:10,borderRadius:2,background:"#1e3a5f",border:"1px solid #2a4a6e",flexShrink:0}}/>
          Inactive
        </div>

        {/* Clear all */}
        {(providerFilter.length>0||stateFilter.length>0) && (
          <button onClick={()=>{setProviderFilter([]);setStateFilter([]);setClickedState(null);}} style={{
            background:"none",border:"1px solid #374151",borderRadius:4,color:"#6b7280",
            padding:"3px 10px",fontSize:11,cursor:"pointer",marginLeft:4,
          }}>✕ Clear all</button>
        )}
      </div>

      {/* Map */}
      <div style={{background:"#0d1117",borderRadius:12,border:"1px solid #1e2b42",overflow:"hidden",position:"relative"}}>
        {loading ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:400,color:"#4b5563",flexDirection:"column",gap:12}}>
            <div style={{fontSize:28}}>🌐</div>
            <div style={{fontSize:13}}>Loading geographic data...</div>
          </div>
        ) : !geoData ? (
          <div style={{padding:40,textAlign:"center",color:"#4b5563",fontSize:13}}>Could not load map data.</div>
        ) : (
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
            <rect width={W} height={H} fill="#0d1117"/>
            {geoData.features.map(feature => {
              const fips = String(feature.id).padStart(2,"0");
              const st = FIPS_TO_STATE[fips];
              if (!st) return null;
              const stateFill = getStateFill(st);
              const {fill,stroke,opacity,inactive,restricted} = stateFill;
              const isClicked = clickedState===st;
              const pathD = pathGen(feature);
              if (!pathD) return null;
              return (
                <path
                  key={st}
                  className="geo-path"
                  d={pathD}
                  fill={fill}
                  stroke={isClicked?"#ffffff":stroke}
                  strokeWidth={isClicked?2.5:0.7}
                  opacity={opacity}
                  style={{cursor:"pointer"}}
                  onClick={()=>setClickedState(isClicked?null:st)}
                  onMouseEnter={e=>{
                    const svg=e.target.closest("svg");
                    const rect=svg.getBoundingClientRect();
                    setTooltip({st, x:(e.clientX-rect.left)*W/rect.width, y:(e.clientY-rect.top)*H/rect.height, recs:stateMap[st], restricted, inactive});
                  }}
                  onMouseMove={e=>{
                    const svg=e.target.closest("svg");
                    const rect=svg.getBoundingClientRect();
                    setTooltip(t=>t?{...t,x:(e.clientX-rect.left)*W/rect.width,y:(e.clientY-rect.top)*H/rect.height}:null);
                  }}
                  onMouseLeave={()=>setTooltip(null)}
                />
              );
            })}

            {/* Tooltip */}
            {tooltip && (() => {
              const {st,x,y,recs:tr,restricted,inactive} = tooltip;
              const uniqueProv = tr ? [...new Set(tr.map(r=>r.provider))] : [];
              const tx = x>W-230?x-220:x+14;
              const ty = y>H-110?y-100:y+10;
              const isSpecial = restricted || inactive;
              const h = isSpecial ? 56 : (48 + Math.min(uniqueProv.length,4)*18);
              const borderColor = restricted ? "#d97706" : inactive ? "#2a4a6e" : "#2d3652";
              const tagColor = restricted ? "#d97706" : "#3b82f6";
              const tagText = restricted ? "Not open to new patients" : "Inactive";
              return (
                <g style={{pointerEvents:"none"}}>
                  <rect x={tx} y={ty} width={210} height={h} rx={6} fill="#1a2234" stroke={borderColor} strokeWidth={1}/>
                  <text x={tx+12} y={ty+20} fontSize={13} fontWeight="600" fill="#f9fafb" fontFamily="'DM Mono',monospace">
                    {STATE_NAMES[st]||st}
                  </text>
                  {isSpecial
                    ? <>
                        <rect x={tx+12} y={ty+30} width={6} height={6} rx={1} fill={tagColor}/>
                        <text x={tx+22} y={ty+38} fontSize={10} fill={tagColor} fontFamily="'DM Mono',monospace">{tagText}</text>
                        <text x={tx+12} y={ty+52} fontSize={10} fill="#6b7280" fontFamily="'DM Mono',monospace">Click for details</text>
                      </>
                    : uniqueProv.length===0
                      ? <text x={tx+12} y={ty+38} fontSize={11} fill="#4b5568" fontFamily="'DM Mono',monospace">No licensed providers</text>
                      : <>
                          <text x={tx+12} y={ty+36} fontSize={10} fill="#6b7280" fontFamily="'DM Mono',monospace">
                            {uniqueProv.length} provider{uniqueProv.length>1?"s":""} · {tr.length} license{tr.length>1?"s":""}
                          </text>
                          {uniqueProv.slice(0,4).map((p,i)=>(
                            <g key={p}>
                              <rect x={tx+12} y={ty+46+i*18} width={6} height={6} rx={1} fill={providerColor(p)}/>
                              <text x={tx+22} y={ty+54+i*18} fontSize={10} fill="#9ca3af" fontFamily="'DM Mono',monospace">
                                {cleanName(p).length>24?cleanName(p).slice(0,22)+"…":cleanName(p)}
                              </text>
                            </g>
                          ))}
                          {uniqueProv.length>4 && <text x={tx+12} y={ty+46+4*18} fontSize={9} fill="#4b5568" fontFamily="'DM Mono',monospace">+{uniqueProv.length-4} more</text>}
                        </>
                  }
                </g>
              );
            })()}
          </svg>
        )}
      </div>

      {/* State filter summary strip */}
      {stateFilter.length>0 && (
        <div style={{marginTop:12,background:"#1a2234",border:"1px solid #1e2b42",borderRadius:8,padding:"12px 16px"}}>
          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:"#4b5563",marginBottom:8}}>
            Highlighted states ({stateFilter.length}) — {providersInSelectedStates.length} provider(s) licensed
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {stateFilter.map(st=>{
              const recs = stateMap[st]||[];
              const provs = [...new Set(recs.map(r=>r.provider))];
              return (
                <div key={st} onClick={()=>setClickedState(st)} style={{
                  background:"#111827",border:"1px solid #1e2b42",borderRadius:6,padding:"6px 10px",
                  cursor:"pointer",fontSize:12,
                  borderColor:provs.length>0?"#10b981":"#374151",
                }}>
                  <span style={{fontWeight:500,color:provs.length>0?"#10b981":"#4b5568"}}>{st}</span>
                  <span style={{color:"#6b7280",marginLeft:6}}>{provs.length} provider{provs.length!==1?"s":""}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clicked state detail */}
      {clickedState && (
        <div style={{marginTop:12,background:"#1a2234",border:`1px solid ${NOT_OPEN_STATES.has(clickedState)?"#d97706":INACTIVE_STATES.has(clickedState)?"#2a4a6e":"#1e2b42"}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${NOT_OPEN_STATES.has(clickedState)?"#2d1e06":INACTIVE_STATES.has(clickedState)?"#0f1a2e":"#1e2b42"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>{STATE_NAMES[clickedState]}</span>
              {NOT_OPEN_STATES.has(clickedState)
                ? <span style={{fontSize:12,background:"#d9770622",color:"#d97706",border:"1px solid #d9770655",borderRadius:5,padding:"3px 10px",fontWeight:500}}>
                    ⚠ Not open to new patients
                  </span>
                : INACTIVE_STATES.has(clickedState)
                ? <span style={{fontSize:12,background:"#1e3a5f33",color:"#60a5fa",border:"1px solid #3b82f655",borderRadius:5,padding:"3px 10px",fontWeight:500}}>
                    Inactive
                  </span>
                : <span style={{fontSize:12,color:"#6b7280"}}>
                    {[...new Set(clickedRecs.map(r=>r.provider))].length} provider(s) · {clickedRecs.length} license record(s)
                  </span>
              }
            </div>
            <button onClick={()=>setClickedState(null)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:20}}>×</button>
          </div>
          {NOT_OPEN_STATES.has(clickedState) ? (
            <div style={{padding:"20px 20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14,background:"#1f1506",border:"1px solid #d9770633",borderRadius:8,padding:"16px"}}>
                <div style={{fontSize:24,lineHeight:1}}>⚠</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#fbbf24",marginBottom:6}}>{STATE_NAMES[clickedState]} is currently not open to new patients.</div>
                  <div style={{fontSize:12,color:"#9ca3af",lineHeight:1.6}}>
                    Fountain holds active licenses in this state but has paused accepting new patients. Existing patients continue to receive care. Check back for updates on when this state reopens.
                  </div>
                </div>
              </div>
              {clickedRecs.length > 0 && (
                <div style={{marginTop:14}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:"#4b5563",marginBottom:10}}>Licensed providers in {STATE_NAMES[clickedState]}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
                    {clickedRecs.map((r,i)=>{
                      const c = providerColor(r.provider);
                      return (
                        <div key={i} style={{background:"#111827",borderRadius:8,padding:"10px 13px",borderLeft:`3px solid ${c}`,opacity:0.7}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{width:7,height:7,borderRadius:2,background:c,flexShrink:0}}/>
                            <span style={{fontSize:12,fontWeight:500}}>{cleanName(r.provider)}</span>
                          </div>
                          <div style={{fontSize:11,color:"#4b5568",marginTop:5,fontFamily:"'DM Mono',monospace"}}>{r.license}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : INACTIVE_STATES.has(clickedState) ? (
            <div style={{padding:"20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14,background:"#0c1829",border:"1px solid #2a4a6e",borderRadius:8,padding:"16px"}}>
                <div style={{fontSize:24,lineHeight:1}}>🕐</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#60a5fa",marginBottom:6}}>{STATE_NAMES[clickedState]} is currently inactive.</div>
                  <div style={{fontSize:12,color:"#9ca3af",lineHeight:1.6}}>
                    Fountain is not yet operating in this state. Stay tuned — we're actively expanding our coverage.
                  </div>
                </div>
              </div>
              {clickedRecs.length > 0 && (
                <div style={{marginTop:14}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:"#4b5563",marginBottom:10}}>Licensed providers in {STATE_NAMES[clickedState]}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
                    {clickedRecs.map((r,i)=>{
                      const c = providerColor(r.provider);
                      return (
                        <div key={i} style={{background:"#111827",borderRadius:8,padding:"10px 13px",borderLeft:`3px solid ${c}`,opacity:0.6}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{width:7,height:7,borderRadius:2,background:c,flexShrink:0}}/>
                            <span style={{fontSize:12,fontWeight:500}}>{cleanName(r.provider)}</span>
                          </div>
                          <div style={{fontSize:11,color:"#4b5568",marginTop:5,fontFamily:"'DM Mono',monospace"}}>{r.license}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : clickedRecs.length===0 ? (
            <div style={{padding:"24px 20px",color:"#4b5563",fontSize:13}}>No licensed providers in {STATE_NAMES[clickedState]}.</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10,padding:14}}>
              {clickedRecs.map((r,i)=>{
                const c = providerColor(r.provider);
                return (
                  <div key={i} style={{background:"#111827",borderRadius:8,padding:"12px 14px",borderLeft:`3px solid ${c}`,border:`1px solid ${c}22`,borderLeftWidth:3,borderLeftColor:c}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:500}}>{cleanName(r.provider)}</span>
                      </div>
                      {r.stateLabel !== r.state && (
                        <span style={{fontSize:10,padding:"2px 6px",borderRadius:3,background:c+"22",color:c,whiteSpace:"nowrap"}}>{r.stateLabel}</span>
                      )}
                    </div>
                    <div style={{fontSize:11,color:"#6b7280",marginTop:6,fontFamily:"'DM Mono',monospace"}}>
                      {r.license}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
