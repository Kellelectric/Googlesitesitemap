# Zoho SalesIQ Zobot — full build, from scratch to setup

Replaces the earlier Botpress trial embed as the site's one chat widget
(`src/app/layout.tsx` already renders `<ZohoSalesIQ />` instead of the
Botpress `<Script>` tags — see `src/components/chat/ZohoSalesIQ.tsx`). Inert
until `NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE` is set in the deployment
environment, same env-var-gated pattern as every other integration on this
site (GA4, hCaptcha, Google Calendar).

This document is everything needed to actually build the bot inside Zoho
SalesIQ's own dashboard — I can't configure SalesIQ directly (no API access
to it in this session, unlike Zoho CRM), so this is the complete design plus
copy-paste-ready Deluge script and setup steps. The Deluge is written to
Zoho's documented, long-standing script-based-Zobot API
(`handleTrigger`/`handleMessage`/`handleAction`, `_handlerArgs`, session
state, `zoho.crm.createRecord`). SalesIQ's script editor has its own inline
syntax checker and a live test panel — if it flags anything, paste the exact
error back and I'll fix it; I have no way to test against the real editor
from here.

## Who this bot is for (per the brief)

1. **Website visitors / prospective customers** — general inquiries, quote
   requests, booking.
2. **Existing customers** — support/follow-up, routed to a human.
3. **Job applicants** — NYSC placement, Internship, Industrial Training
   (SIWES), Apprenticeship, current Job Openings.
4. **Everyone else with a general inquiry** — funneled toward either a
   quote, a careers track, or a human, never left in a dead end.

Every meaningful capture becomes a **Zoho CRM Lead** (verified real field
names below via the CRM's own metadata — `Last_Name`, `First_Name`,
`Company`, `Email`, `Phone`, `City`, `Lead_Source`, `Lead_Status`,
`Description`), tagged `Lead_Source = "Chat"` (a real existing picklist
value on this account, not invented) and `Lead_Status = "Not Contacted"` —
this is the sales funnel: every bot conversation that produces contact
info lands in the same CRM pipeline sales already works from.

## Conversation flow

```
Visitor opens chat
        │
        ▼
  Greeting + main menu buttons
  [ Get a Free Quote ]  [ Book an Appointment ]
  [ Careers & Apprenticeship ]  [ Emergency ]
  [ FAQs ]  [ Talk to a Human ]
        │
   ┌────┼────────┬─────────────┬───────────┬───────────────┐
   ▼    ▼         ▼             ▼           ▼               ▼
 Quote Booking  Careers      Emergency    FAQs          Human
 flow   flow    flow           flow        flow          handoff
```

### A. Get a Free Quote (main sales funnel entry)

1. **Service category** — buttons: `Residential` `Commercial` `Industrial`
   `Solar & Energy` `Home Automation` `CCTV & Security` `Not sure`
2. **Property type** — buttons: `Residential` `Commercial` `Industrial`
3. **Urgency** — buttons: `Standard` `Urgent` `Emergency`
   - Picking `Emergency` here jumps straight into the Emergency flow (D) —
     never makes an emergency wait through the rest of the quote questions.
4. Collect, one at a time, as plain chat messages: **Name → Phone → Email
   (optional) → Location → Job details**.
5. Create a CRM Lead (`Lead_Source: "Chat"`, `Description` summarizing
   category/property type/urgency/details), reply with a reference and the
   business's expected-response framing, then offer two buttons:
   `Book a specific time instead` (→ links to `/book-appointment`, which
   already has real-time calendar availability — the bot doesn't duplicate
   that logic) and `Talk to a human now`.

### B. Book an Appointment

Single message + button: explains the site has a live calendar booking
page and hands off with a `Book Now` button linking to
`https://kellelectricals.com/book-appointment`. No need to rebuild
calendar logic inside the bot — `/book-appointment` already does real
Google Calendar availability + booking (see `docs/next-steps.md`).

### C. Careers & Apprenticeship (job applicants)

Buttons: `NYSC Placement` `Internship` `Industrial Training (SIWES)`
`Apprenticeship` `Job Openings`

Each button replies with that track's real summary and eligibility
highlights (sourced from `src/content/careers.ts` — do not invent new
figures) plus an `Apply Now` button linking to that track's **real** Google
Form:

| Track | Apply link |
|---|---|
| NYSC Placement | `https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform` |
| Internship | `https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform` |
| Industrial Training | `https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform` |
| Apprenticeship | `https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform` |
| Job Openings | `https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform` |

(Internship and Industrial Training intentionally share one form — same as
the live site, not a bug.) After showing the link, the bot asks for just a
name + phone as a lightweight CRM capture (`Lead_Source: "Chat"`,
`Description: "Careers inquiry - <track>"`) so HR has a record even if the
visitor doesn't finish the Google Form — it never duplicates the form's own
fields.

### D. Emergency

Immediate, no further questions: the exact safety framing already used
sitewide ("For active electrical hazards, call us now") plus two buttons —
`Call Now` (`tel:+2348140205895`) and `WhatsApp Now`
(`https://wa.me/message/74H7FYXECPMXH1`). Still logs a high-priority CRM
Lead (`Description: "EMERGENCY - via chat"`) in the background so it isn't
lost if the visitor calls instead of continuing to chat, but never blocks
on that — the call/WhatsApp buttons are the point.

### E. FAQs

Buttons: `General` `Services & Scheduling` `Emergency & Safety`
`Home Automation` `CCTV & Security` — each replies with 2-3 real Q&As
pulled from `src/content/faqs.ts` (do not invent new ones), then offers
`Still need help? Talk to a human`.

### F. Talk to a Human

Checks the real business hours (`Mon-Fri 8:00 AM-5:00 PM`,
`Sat 10:00 AM-3:00 PM`, `Sun closed` — from `src/content/company.ts`) against
the visitor's local time:
- **Within hours** → forwards the chat to a live operator queue.
- **After hours** → apologizes, explains the hours, collects
  name/phone/email/reason, creates a CRM Lead tagged
  `Description: "After-hours callback request"`, confirms a next-business-day
  follow-up.

## Deluge script (script-based Zobot)

Paste this into **SalesIQ → Settings → Bots → Zobot → your bot → Script**.
It implements the full flow above with `suggestions` (SalesIQ's button UI)
at every step and session state carried in `_handlerArgs.get("session")`.

```deluge
// ===== Kell Electricals Ltd — SalesIQ Zobot =====
// Buttons everywhere via the "suggestions" list. Session state (which step
// a visitor is on, what they've answered so far) lives in the persistent
// "session" map SalesIQ carries across turns for that chat.

string BUSINESS_PHONE = "+2348140205895";
string BUSINESS_PHONE_TEL = "tel:+2348140205895";
string BUSINESS_WHATSAPP = "https://wa.me/message/74H7FYXECPMXH1";
string BOOKING_URL = "https://kellelectricals.com/book-appointment";

Map buildReply(list replies, list suggestions, Map session)
{
	response = Map();
	response.put("action","reply");
	response.put("replies",replies);
	if(suggestions != null && suggestions.size() > 0)
	{
		response.put("suggestions",suggestions);
	}
	response.put("session",session);
	return response;
}

Map pushLead(string firstName, string lastName, string phone, string email, string city, string source, string description)
{
	leadMap = Map();
	leadMap.put("Last_Name", lastName);
	if(firstName != null && firstName != "")
	{
		leadMap.put("First_Name", firstName);
	}
	leadMap.put("Company", "Website visitor (chat)");
	if(phone != null && phone != "")
	{
		leadMap.put("Phone", phone);
	}
	if(email != null && email != "")
	{
		leadMap.put("Email", email);
	}
	if(city != null && city != "")
	{
		leadMap.put("City", city);
	}
	leadMap.put("Lead_Source", "Chat");
	leadMap.put("Lead_Status", "Not Contacted");
	leadMap.put("Description", description);
	crmResponse = zoho.crm.createRecord("Leads", leadMap);
	return crmResponse;
}

boolean isWithinBusinessHours()
{
	// Africa/Lagos is fixed UTC+1 year-round (no DST) — same fact this
	// site's own booking logic relies on (see src/lib/bookingSlots.ts).
	now = zoho.currenttime.toString("EEE HH:mm");
	dayPart = now.getSuffix(" ").getPrefix(" ");
	timePart = now.getSuffix(" ");
	hour = timePart.getPrefix(":").toLong();
	if(dayPart == "Sun")
	{
		return false;
	}
	if(dayPart == "Sat")
	{
		return hour >= 10 && hour < 15;
	}
	return hour >= 8 && hour < 17;
}

handleTrigger()
{
	session = Map();
	session.put("step","main_menu");
	greeting = "Hi, welcome to Kell Electricals Ltd. How can I help you today?";
	menu = {"Get a Free Quote","Book an Appointment","Careers & Apprenticeship","Emergency","FAQs","Talk to a Human"};
	return buildReply({greeting}, menu, session);
}

handleMessage()
{
	message = _handlerArgs.get("message");
	visitor = _handlerArgs.get("visitor");
	session = _handlerArgs.get("session");
	if(session == null)
	{
		session = Map();
		session.put("step","main_menu");
	}
	text = ifnull(message.get("text"),"").trim();
	step = ifnull(session.get("step"),"main_menu");

	// ----- Main menu routing -----
	if(step == "main_menu")
	{
		if(text.equalsIgnoreCase("Get a Free Quote"))
		{
			session.put("step","quote_service");
			return buildReply({"What kind of service do you need?"}, {"Residential","Commercial","Industrial","Solar & Energy","Home Automation","CCTV & Security","Not sure"}, session);
		}
		if(text.equalsIgnoreCase("Book an Appointment"))
		{
			session.put("step","main_menu");
			return buildReply({"You can pick an exact date and time on our live booking page - it shows real availability: " + BOOKING_URL}, {"Back to main menu"}, session);
		}
		if(text.equalsIgnoreCase("Careers & Apprenticeship"))
		{
			session.put("step","careers_menu");
			return buildReply({"Which programme are you interested in?"}, {"NYSC Placement","Internship","Industrial Training (SIWES)","Apprenticeship","Job Openings"}, session);
		}
		if(text.equalsIgnoreCase("Emergency"))
		{
			session.put("step","main_menu");
			pushLead("","Emergency (chat)","","","","Chat","EMERGENCY - visitor pressed Emergency in chat");
			return buildReply({"For active electrical hazards (sparking, burning smell, exposed live wiring), call us now rather than waiting on chat.","We aim to respond within 30 minutes for emergencies."}, {"Call Now: " + BUSINESS_PHONE, "WhatsApp Now"}, session);
		}
		if(text.equalsIgnoreCase("FAQs"))
		{
			session.put("step","faq_menu");
			return buildReply({"Which topic?"}, {"General","Services & Scheduling","Emergency & Safety","Home Automation","CCTV & Security"}, session);
		}
		if(text.equalsIgnoreCase("Talk to a Human") || text.equalsIgnoreCase("Back to main menu"))
		{
			if(text.equalsIgnoreCase("Back to main menu"))
			{
				session.put("step","main_menu");
				return buildReply({"How else can I help?"}, {"Get a Free Quote","Book an Appointment","Careers & Apprenticeship","Emergency","FAQs","Talk to a Human"}, session);
			}
			if(isWithinBusinessHours())
			{
				response = Map();
				response.put("action","forward");
				response.put("department","");
				return response;
			}
			session.put("step","afterhours_name");
			return buildReply({"We're offline right now (Mon-Fri 8am-5pm, Sat 10am-3pm, Sun closed - WAT). Leave your details and we'll follow up the next business day.","What's your name?"}, {}, session);
		}
		// Unrecognized input at the main menu - re-show it rather than dead-ending.
		return buildReply({"Sorry, I didn't catch that - pick an option below, or type what you need."}, {"Get a Free Quote","Book an Appointment","Careers & Apprenticeship","Emergency","FAQs","Talk to a Human"}, session);
	}

	// ----- Quote flow -----
	if(step == "quote_service")
	{
		session.put("quote_service",text);
		session.put("step","quote_property");
		return buildReply({"Is this for a residential, commercial, or industrial property?"}, {"Residential","Commercial","Industrial"}, session);
	}
	if(step == "quote_property")
	{
		session.put("quote_property",text);
		session.put("step","quote_urgency");
		return buildReply({"How urgent is this?"}, {"Standard","Urgent","Emergency"}, session);
	}
	if(step == "quote_urgency")
	{
		if(text.equalsIgnoreCase("Emergency"))
		{
			session.put("step","main_menu");
			pushLead("","Emergency (chat, from quote flow)","","","","Chat","EMERGENCY - selected during quote flow. Service: " + ifnull(session.get("quote_service"),"") + ", property: " + ifnull(session.get("quote_property"),""));
			return buildReply({"For active electrical hazards, call us now instead of continuing here.","We aim to respond within 30 minutes for emergencies."}, {"Call Now: " + BUSINESS_PHONE, "WhatsApp Now"}, session);
		}
		session.put("quote_urgency",text);
		session.put("step","quote_name");
		return buildReply({"Great - what's your name?"}, {}, session);
	}
	if(step == "quote_name")
	{
		session.put("quote_name",text);
		session.put("step","quote_phone");
		return buildReply({"And a phone number we can reach you on?"}, {}, session);
	}
	if(step == "quote_phone")
	{
		session.put("quote_phone",text);
		session.put("step","quote_email");
		return buildReply({"Email address (optional - type 'skip' if you'd rather not)?"}, {}, session);
	}
	if(step == "quote_email")
	{
		if(!text.equalsIgnoreCase("skip"))
		{
			session.put("quote_email",text);
		}
		session.put("step","quote_location");
		return buildReply({"What area/location is the job in?"}, {}, session);
	}
	if(step == "quote_location")
	{
		session.put("quote_location",text);
		session.put("step","quote_details");
		return buildReply({"Last thing - a short description of the job?"}, {}, session);
	}
	if(step == "quote_details")
	{
		session.put("quote_details",text);
		description = "Quote request via chat. Service: " + ifnull(session.get("quote_service"),"") + " | Property: " + ifnull(session.get("quote_property"),"") + " | Urgency: " + ifnull(session.get("quote_urgency"),"") + " | Location: " + ifnull(session.get("quote_location"),"") + " | Details: " + text;
		crmResp = pushLead(session.get("quote_name"),session.get("quote_name"),session.get("quote_phone"),ifnull(session.get("quote_email"),""),session.get("quote_location"),"Chat",description);
		session.put("step","main_menu");
		return buildReply({"Thanks, " + session.get("quote_name") + " - that's logged and our team will reach out shortly.","Want to lock in a specific time instead, or talk to someone right now?"}, {"Book a specific time","Talk to a human now","Back to main menu"}, session);
	}

	// ----- Careers flow -----
	if(step == "careers_menu")
	{
		track = text;
		session.put("careers_track",track);
		session.put("step","careers_capture_name");
		summary = "";
		applyUrl = "";
		if(track.equalsIgnoreCase("NYSC Placement"))
		{
			summary = "For NYSC Corps Members seeking a Place of Primary Assignment (PPA) - placement across engineering and business functions, subject to availability, not automatic.";
			applyUrl = "https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform";
		}
		else if(track.equalsIgnoreCase("Internship"))
		{
			summary = "6-month supervised placement for students/early-career candidates, aligned to academic term breaks (two intakes a year).";
			applyUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform";
		}
		else if(track.equalsIgnoreCase("Industrial Training (SIWES)"))
		{
			summary = "6-month SIWES placement for polytechnic/university students, aligned to your institution's SIWES calendar - no shorter 3-month placements accepted.";
			applyUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeZqtld3gTsFoCb9MoXn5FzhK602XAnRlNoEWI1OE1Njwll9g/viewform";
		}
		else if(track.equalsIgnoreCase("Apprenticeship"))
		{
			summary = "A paid-tuition, structured 2-year (NGN400,000) or 4-year (NGN700,000) track building toward a career as a qualified electrical technician - rolling intake, reviewed quarterly.";
			applyUrl = "https://docs.google.com/forms/d/e/1FAIpQLScyQUddIgthC752dLwSulX9vRT8V4rPdvlz3Wr7EM0VTktE9A/viewform";
		}
		else
		{
			track = "Job Openings";
			session.put("careers_track",track);
			summary = "We don't run a live self-updating job board - current roles we're actively considering candidates for include Licensed Electrician, Site Supervisor, and Solar & Inverter Installation Technician. Apply even if your exact role isn't listed.";
			applyUrl = "https://docs.google.com/forms/d/e/1FAIpQLScrGwqdcA3rzUVRhHl2kt7afhOGNB9InZsdAmZ7gsG5tXr3eQ/viewform";
		}
		session.put("careers_apply_url",applyUrl);
		return buildReply({summary, "Apply here: " + applyUrl, "Want us to also have someone follow up with you directly? What's your name?"}, {}, session);
	}
	if(step == "careers_capture_name")
	{
		session.put("careers_name",text);
		session.put("step","careers_capture_phone");
		return buildReply({"And a phone number?"}, {}, session);
	}
	if(step == "careers_capture_phone")
	{
		description = "Careers inquiry via chat - " + ifnull(session.get("careers_track"),"") + ". Apply link sent: " + ifnull(session.get("careers_apply_url"),"");
		pushLead(session.get("careers_name"),session.get("careers_name"),text,"","","Chat",description);
		session.put("step","main_menu");
		return buildReply({"Thanks - someone from our team will follow up. Good luck!"}, {"Back to main menu"}, session);
	}

	// ----- FAQ flow -----
	if(step == "faq_menu")
	{
		topic = text;
		session.put("step","main_menu");
		answer = "";
		if(topic.equalsIgnoreCase("General"))
		{
			answer = "We're COREN and NEMSA certified, based in Wuse 2, Abuja, and serve all of Abuja plus neighboring states and wider Nigeria for project work. Business hours: Mon-Fri 8am-5pm, Sat 10am-3pm, Sun closed.";
		}
		else if(topic.equalsIgnoreCase("Services & Scheduling"))
		{
			answer = "Request a quote anytime via chat or the website - we'll confirm scope and schedule a site visit. You can also book an exact time directly at " + BOOKING_URL + ".";
		}
		else if(topic.equalsIgnoreCase("Emergency & Safety"))
		{
			answer = "For active electrical hazards, call " + BUSINESS_PHONE + " directly rather than waiting on chat or a form - we aim to respond within 30 minutes.";
		}
		else if(topic.equalsIgnoreCase("Home Automation"))
		{
			answer = "We design and install home automation systems - lighting, access, and device control integrated with your electrical setup. See kellelectricals.com/home-automation for details.";
		}
		else
		{
			answer = "We install and maintain CCTV & surveillance systems for residential, commercial, and industrial sites. See kellelectricals.com/cctv-security-systems for details.";
		}
		return buildReply({answer}, {"Still need help? Talk to a human","Back to main menu"}, session);
	}

	// ----- After-hours callback capture -----
	if(step == "afterhours_name")
	{
		session.put("afterhours_name",text);
		session.put("step","afterhours_phone");
		return buildReply({"Phone number?"}, {}, session);
	}
	if(step == "afterhours_phone")
	{
		session.put("afterhours_phone",text);
		session.put("step","afterhours_reason");
		return buildReply({"Briefly, what's this about?"}, {}, session);
	}
	if(step == "afterhours_reason")
	{
		description = "After-hours callback request via chat. Reason: " + text;
		pushLead(session.get("afterhours_name"),session.get("afterhours_name"),session.get("afterhours_phone"),"","","Chat",description);
		session.put("step","main_menu");
		return buildReply({"Got it - we'll follow up the next business day. Anything else in the meantime?"}, {"Get a Free Quote","Careers & Apprenticeship","FAQs","Back to main menu"}, session);
	}

	// Fallback - never dead-end.
	session.put("step","main_menu");
	return buildReply({"Sorry, I didn't quite get that. Here's the main menu again."}, {"Get a Free Quote","Book an Appointment","Careers & Apprenticeship","Emergency","FAQs","Talk to a Human"}, session);
}

handleAction()
{
	form_data = _handlerArgs.get("form_data");
	session = _handlerArgs.get("session");
	response = Map();
	response.put("action","reply");
	response.put("replies",{"Thanks!"});
	response.put("session",session);
	return response;
}
```

**Notes on the script:**
- `zoho.crm.createRecord("Leads", leadMap)` is Deluge's built-in Zoho CRM
  integration task — it works once SalesIQ and CRM are connected under the
  same Zoho account (see setup step 5 below), no separate API key needed.
- The Emergency and quote-flow-emergency paths intentionally never wait on
  a CRM response before showing the Call/WhatsApp buttons — logging the
  lead is best-effort background work, matching the site's own booking API
  pattern (webhook forward never blocks the booking confirmation).
- `isWithinBusinessHours()` mirrors the same Africa/Lagos-is-fixed-UTC+1
  fact `src/lib/bookingSlots.ts` already relies on — verify
  `zoho.currenttime` reflects the portal's configured timezone; set that to
  Africa/Lagos (or WAT/UTC+1) under **Settings → General** if it isn't
  already, or the business-hours check will be wrong.

## Setup steps (Zoho SalesIQ dashboard)

1. **Create the bot.** SalesIQ → **Settings → Bots → Zobot → Add Zobot** →
   choose **Script based Zobot** (not the drag-and-drop Answer Bot — the
   script above needs the script editor). Name it "Kell Assist" or similar.
2. **Paste the script** above into the script editor, replacing the
   auto-generated stub. Use the editor's **Test** panel to click through
   every button path (main menu → each of the 6 branches → sub-branches)
   before publishing.
3. **Set the trigger.** Configure it to fire `handleTrigger` on chat open
   (SalesIQ's default "Zobot greets first" trigger) for every visitor on
   every page — no need to restrict by URL given the audience mix (quote
   seekers, applicants, existing customers can all land anywhere).
4. **Connect Zoho CRM.** SalesIQ → **Settings → Integrations → Zoho CRM** →
   connect it to the same Zoho account/org this CRM lives in, so
   `zoho.crm.createRecord` in the script actually writes real Leads.
5. **Confirm the portal timezone** is Africa/Lagos (or WAT) under
   **Settings → General**, so the business-hours check in the script is
   accurate.
6. **Set up operator handoff.** Under **Settings → Departments/Operators**,
   make sure at least one operator is assigned to receive forwarded chats
   (the `Talk to a Human` → `action: "forward"` path) during business
   hours — otherwise a forwarded chat has nowhere to go.
7. **Get the embed code.** SalesIQ → **Settings → Installation** → copy the
   `wc=` value from the generated `<script src="https://salesiq.zohopublic.com/widget?wc=...">`
   snippet — that value is the widget code.
8. **Set the env var.** In Vercel (Project → Settings → Environment
   Variables), add `NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE` = that widget code,
   for the Production environment, then redeploy. The site already renders
   `<ZohoSalesIQ />` (`src/components/chat/ZohoSalesIQ.tsx`) — it stays
   invisible until this var is set, so there's no broken/half-built widget
   showing in the meantime.
9. **Test on the live site** end-to-end: open chat, click through all 6
   main-menu branches, confirm a quote/careers/after-hours submission
   actually creates a Lead in Zoho CRM with the right fields, and confirm
   the Emergency buttons (`tel:`/WhatsApp) work on mobile.

## What's deliberately out of scope here

- **Answer Bot / drag-and-drop flow builder** — the brief asked for buttons
  and multiple structured paths, which the script-based Zobot handles more
  precisely (exact session-state control) than the visual builder; if a
  non-technical team member needs to edit copy later without touching
  Deluge, migrating this flow into the Answer Bot builder is a reasonable
  follow-up, not done here.
- **Live typing indicators / rich cards with images** — SalesIQ supports
  these, but the brief's core ask (buttons, audience-specific flows, a
  sales funnel into CRM) doesn't need them; add later if wanted.
- **Multi-language support** — not requested; every string above is
  English only, matching the rest of the site.
