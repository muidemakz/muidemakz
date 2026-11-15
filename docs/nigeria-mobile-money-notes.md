# Mobile money in Nigeria: research notes

Working notes for the Nsimbi concept and any future Nigeria-specific mobile money design. Sourced from web search summaries, not from reading the primary documents in full. Check the CBN texts before quoting any rule in public.

## How it works

- **Phone-linked wallets.** Users link a phone number to a wallet and use it through apps, text messages or USSD codes. Feature phones can use USSD. Source: [Mobile Finance, Developing Telecoms](https://developingtelecoms.com/telecom-technology/financial-services/1809-mobile-payment-in-nigeria.html), [Mobile Finance, USSD](https://www.developingtelecoms.com/telecom-technology/financial-services/17316-ussd-service-boosts-nigerian-mobile-transaction-options.html)
- **Agents handle cash.** Cash in and cash out happen through physical agents, not only through the wallet. Moniepoint reports over 50,000 agents, and PalmPay cites a network of over 500,000 agents for customers without smartphones. The PalmPay figure comes from a low-quality source, so treat it as a claim, not a fact. Source: [Market summary, search results](https://imarcgroup.com/nigeria-mobile-money-market), [Mobile money and USSD, Guardian](https://guardian.ng/?p=2622508)
- **USSD is billed.** From 18 June 2025, subscribers pay for USSD sessions from their airtime under an End-User Billing change. Source: [Mobile money search results, BusinessDay and others](https://businessday.ng/?p=975272)

## Who runs it

- **MTN MoMo PSB.** MTN's subsidiary MoMo Payment Service Bank Limited holds a Payment Service Bank (PSB) licence and began operating around May 2022, according to a Technext report. A PSB licence is narrower than a full bank licence. Sources disagree on what it allows: one says lending and FX are excluded, another says it allows lending and bill payments. Check the CBN for the current scope. Sources: [Connecting Africa](https://www.connectingafrica.com/mobile-money/mtn-momo-bank-begins-operations-in-nigeria), [Financial Afrik, 2021](https://www.financialafrik.com/2021/11/06/nigeria-la-banque-centrale-donne-un-accord-de-principe-au-service-mobile-banking-de-mtn), [Technext, 2022](https://technext.ng/2022/05/20/mtns-momo-payment-service-bank-begins-op/)
- **MoMo PSB scale and licences.** A 2025 Fintech Magazine report says over 5 million people use MoMo each month and more than 324,000 merchants use MoMoPay. MoMo PSB has also applied for PSSP and PTSP licences. Source: [Fintech Magazine, June 2025](https://fintechmagazine.africa/?p=6026), [Techpoint, 2024](https://techpoint.africa/2024/11/05/mtn-nigerias-momo-psb-to-get-dual-payment-licences-in-regulatory-milestone/)
- **Airtel Africa's PSB** also received a full PSB licence after approval in principle in 2021. Source: same as above.
- **Fintechs.** PalmPay (Mobile Money Operator licence, per one source) and Moniepoint are the agent-led operators most often named. Source: [Nairametrics, 2021](https://nairametrics.com/2021/05/06/the-rise-of-mobile-money-operators-in-nigeria)

## Rules

- **Mobile money guidelines.** The CBN mobile money guidelines apply the agent banking rules to the mobile money agent network. The principal (bank or operator) is always responsible, and it may use a network manager. Source: [CBN Guidelines on Mobile Money Services (2015 PDF)](https://www.cbn.gov.ng/Out/2015/BPSD/Guidelines%20on%20Mobile%20Money%20Services%20in%20Nigeria.pdf), [CBN agent banking guidelines (2013 PDF)](https://www.cbn.gov.ng/Out/2013/CCD/GUIDELINES%20FOR%20THE%20REGULATION%20OF%20AGENT%20BANKING%20AND%20AGENT%20BANKING%20RELATIONSHIPS%20IN%20NIGERIA.pdf)
- **Newer framework.** A 2021 CBN framework sets minimum standards for mobile money operators, with penalties up to licence revocation. Source: [Guardian, CBN guidelines for mobile money operators](https://guardian.ng/apo-press-releases/central-bank-of-nigeria-cbn-issues-new-guidelines-for-mobile-money-operators-in-nigeria-by-ibrahim-moshood/)
- **Single-agent rule for PoS.** A CBN circular dated 3 October 2025 requires each PoS agent to register and operate with a single super-agent, bank or mobile money operator from April 2026. The stated aim is traceability. The industry group AMMAN has asked for the timeline to be reviewed. I did not find whether the timeline changed. Check this before using it. Source: [Intellinews, multi-operator PoS ban](https://www.intellinews.com/nigeria-s-cbn-bans-multi-operator-pos-model-to-simplify-agent-banking-405273)

## What this means for the design

- A Nigerian wallet is agent-led. Cash in and cash out are as important as the in-app balance, so the design should show nearby agents and cash-out steps, not only transfers.
- USSD is a real channel for many users, so a USSD fallback is a fair design direction. Its cost is billed to the user's airtime, so the flow should show the cost.
- The PoS single-agent rule affects how agents are shown. If a user's agent is tied to one operator, the app should say so.
- Bank and operator names matter for the chooser. The current prototype uses Access Bank, GTBank and Zenith Bank. Keep the list short and current.

## Open questions

1. Confirm the current scope of a PSB licence on the CBN site.
2. Confirm whether the April 2026 PoS single-agent rule took effect or was delayed.
3. Confirm current USSD billing and the current agent count from operator reports, not from market-research pages.
4. Decide whether this note stays internal or feeds a public case study. If public, every rule above needs a primary-source link.
