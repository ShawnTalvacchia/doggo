export default function PragueResearchPage() {
  return (
    <>
      <header>
        <p className="research-eyebrow">Competitive Research</p>
        <h1>Prague Dog Care Scene</h1>
        <p>
          How Prague providers build trust today, what a trust-badge
          system should look like on Doggo, and the cold-start seeding
          strategy for launching in three Prague neighbourhoods.
        </p>
        <div className="research-meta">
          <span className="research-meta-tag">Local market study</span>
          <span className="research-meta-tag">Trust patterns</span>
          <span className="research-meta-tag">Badge taxonomy</span>
          <span className="research-meta-tag">Go-to-market</span>
        </div>
      </header>

      <h2>How Prague providers build trust today</h2>
      <p>
        Prague&apos;s dog care market splits into three tiers, each with
        distinct trust-building patterns.
      </p>

      <h3>Tier 1 — Professional services (businesses)</h3>
      <p>
        Pawz (est. 2012), Dogitory (10+ years), Rocky &amp; Skipper,
        ZOOservice (est. 2004), PremiumVet. How they build trust:
      </p>
      <ul>
        <li>
          <strong>Formal credentials.</strong> Czech University of Life
          Sciences cynology degrees, Agility Club instructor certification,
          the Czech National Qualification (Národní kvalifikace Level 4,
          issued by the Ministry of Agriculture — covers anatomy, training
          methods, breed knowledge, legislation). Trainers cite
          international seminar attendance (Ken Ramirez, Susan Garrett).
        </li>
        <li>
          <strong>Years of operation.</strong> Longevity is a primary
          trust signal. &quot;Since 2004&quot; or &quot;10+ years&quot;
          appears prominently.
        </li>
        <li>
          <strong>Named team members with bios.</strong> Pawz names Mirka
          (vet background) and Líza (Master&apos;s in Animal Science).
          Rocky &amp; Skipper centres on Astrid (15 years, 200+ dogs
          trained). Clients reference staff by name in reviews.
        </li>
        <li>
          <strong>Methodology declarations.</strong> &quot;Force-free,
          positive reinforcement&quot; is common. Pawz explicitly states
          no phones/headphones during walks. Philosophy statements
          function as trust signals.
        </li>
        <li>
          <strong>Daily photo/video updates.</strong> Universal across
          professional services. Dogitory sends &quot;multiple
          notifications per day with reports, photos, videos and
          GPS.&quot; Pawz sends SMS, MMS, and more photos via email.
          Rocky &amp; Skipper sends daily videos.
        </li>
        <li>
          <strong>Detailed testimonials.</strong> Long, specific reviews
          citing staff by name, describing transformations (&quot;anxious
          dog became confident&quot;), noting communication quality.
        </li>
        <li>
          <strong>Small group sizes or 1-on-1 care.</strong> Positioned
          as premium vs. kennel/pack approaches.
        </li>
        <li>
          <strong>Multi-channel availability.</strong> WhatsApp,
          Messenger, email, Instagram, phone. Meeting clients where they
          are.
        </li>
      </ul>
      <p>
        <strong>What they don&apos;t do:</strong> insurance mentions are
        rare, formal background checks aren&apos;t advertised, no
        platform-issued badges. Trust is entirely reputation and
        relationship based.
      </p>

      <h3>Tier 2 — Platform sitters (gig workers)</h3>
      <p>
        Platforms: Hlídačky.cz (689 Prague sitters, absorbed DogInni.cz),
        PetBacker, TrustedHousesitters.
      </p>
      <ul>
        <li>
          <strong>HlídačkyVerify™ badge.</strong> Video verification —
          sitters complete a video call to confirm identity. Displayed
          prominently on profiles.
        </li>
        <li>
          <strong>&quot;Booked repeatedly&quot; badge.</strong> Social
          proof that other owners trust this sitter enough to rebook.
        </li>
        <li>
          <strong>&quot;Completed first aid course&quot; badge.</strong>{" "}
          With a dedicated icon. Specialized preparation signal.
        </li>
        <li>
          <strong>Review counts + ratings.</strong> Displayed next to
          pricing (e.g. &quot;(20) reviews, 400 Kč/hour&quot;).
        </li>
        <li>
          <strong>Transparent pricing.</strong> Hourly and daily rates
          shown upfront. No hidden fees.
        </li>
        <li>
          <strong>Filtering by trust.</strong> &quot;Highest-rated by
          families&quot; sort option. Filter by pet type, dog size,
          sitter languages.
        </li>
        <li>
          <strong>Language capabilities.</strong> English / Czech / other
          shown on profiles — critical for Prague&apos;s expat market.
        </li>
      </ul>

      <h3>Tier 3 — Informal / word-of-mouth</h3>
      <p>
        The Facebook group &quot;Pet sitting, dog walking Prague&quot;
        and expat communities (Expats.cz forums) are where many Prague
        dog owners actually find care. Trust here is pure social proof —
        someone in the group vouches for a person.
      </p>
      <ul>
        <li>Personal recommendations from named individuals</li>
        <li>&quot;I&apos;ve used them for 2 years&quot; endorsements</li>
        <li>Photos shared in group of dogs with sitters</li>
        <li>Direct messaging between recommender and seeker</li>
        <li>No platform intermediation — trust flows person to person</li>
      </ul>
      <p>
        <strong>This is what Doggo digitises.</strong> The informal tier
        is Doggo&apos;s natural territory.
      </p>

      <h2>Proposed trust badges for Doggo provider profiles</h2>
      <p>
        Three tiers, all earned or declared. The badge system feeds into
        Doggo&apos;s community trust model rather than replacing it.
      </p>

      <h3>Community-earned badges (primary — unique to Doggo)</h3>
      <p>
        These can&apos;t be faked because they&apos;re derived from
        platform activity.
      </p>
      <table>
        <thead>
          <tr>
            <th>Badge</th>
            <th>How it&apos;s earned</th>
            <th>Display</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Community Regular</strong>
            </td>
            <td>X+ meets in the last 3 months</td>
            <td>&quot;Active in 4 local meets&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>Neighbourhood Anchor</strong>
            </td>
            <td>X+ connections in the same neighbourhood</td>
            <td>&quot;Known by 12 people in Vinohrady&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>Trusted by Your Network</strong>
            </td>
            <td>X of viewer&apos;s connections use this provider</td>
            <td>&quot;Used by 3 people you know&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>Repeat Clients</strong>
            </td>
            <td>X+ owners have booked 3+ times</td>
            <td>&quot;8 repeat clients&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>Care Veteran</strong>
            </td>
            <td>X+ care sessions completed on the platform</td>
            <td>&quot;120+ sessions completed&quot;</td>
          </tr>
        </tbody>
      </table>

      <h3>Credential badges (secondary — self-declared)</h3>
      <p>
        Mirror what Prague professionals already advertise. Entered by the
        provider and — in production — could be verified.
      </p>
      <table>
        <thead>
          <tr>
            <th>Badge</th>
            <th>What it signals</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Certified Trainer</strong>
            </td>
            <td>Národní kvalifikace, cynology degree, Agility Club cert</td>
            <td>Self-declared (icon differs if platform-verified)</td>
          </tr>
          <tr>
            <td>
              <strong>First Aid Trained</strong>
            </td>
            <td>Pet first aid course completion</td>
            <td>Self-declared</td>
          </tr>
          <tr>
            <td>
              <strong>Vet Background</strong>
            </td>
            <td>Veterinary education or experience</td>
            <td>Self-declared</td>
          </tr>
          <tr>
            <td>
              <strong>Force-Free Methods</strong>
            </td>
            <td>Commitment to positive reinforcement training</td>
            <td>Self-declared (reinforced by reviews mentioning it)</td>
          </tr>
          <tr>
            <td>
              <strong>X Years Experience</strong>
            </td>
            <td>Duration of pet care experience</td>
            <td>Self-declared</td>
          </tr>
          <tr>
            <td>
              <strong>Insured</strong>
            </td>
            <td>Carries professional liability insurance</td>
            <td>Self-declared</td>
          </tr>
        </tbody>
      </table>

      <h3>Platform badges (tertiary — awarded by Doggo)</h3>
      <table>
        <thead>
          <tr>
            <th>Badge</th>
            <th>How it&apos;s earned</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Verified Identity</strong>
            </td>
            <td>Completed ID verification</td>
            <td>Future production feature. Confirms real person, not a background check.</td>
          </tr>
          <tr>
            <td>
              <strong>Responsive</strong>
            </td>
            <td>Replies within X hours consistently</td>
            <td>Auto-calculated from messaging data</td>
          </tr>
          <tr>
            <td>
              <strong>Consistent</strong>
            </td>
            <td>Low cancellation rate, on-time</td>
            <td>Auto-calculated from session data</td>
          </tr>
        </tbody>
      </table>

      <h3>How badges display</h3>
      <ul>
        <li>
          <strong>Provider cards in search.</strong> Top 2–3 most relevant
          badges as compact pills below the name/rating. Prioritise
          community-earned &gt; credential &gt; platform.
        </li>
        <li>
          <strong>Provider profile hero.</strong> Full badge row with all
          earned badges. Tappable for detail (&quot;Trusted by your
          network&quot; → shows which connections).
        </li>
        <li>
          <strong>Booking detail.</strong> Relevant badges surface on the
          Info tab to reinforce confidence during booking.
        </li>
      </ul>
      <p>
        <strong>Design principle:</strong> badges reinforce the trust
        model — they don&apos;t replace it. A provider with zero badges
        but Connected status and 5 shared meets is still trustworthy.
        Badges help when evaluating someone you haven&apos;t met yet
        (the Discover → Care path).
      </p>

      <h2>The cold-start seeding strategy</h2>

      <h3>The problem</h3>
      <p>
        Doggo needs providers with trust signals to attract owners, and
        owners attending meets to generate trust signals for providers.
        Classic two-sided marketplace cold start.
      </p>

      <h3>The insight</h3>
      <p>
        <strong>
          Seed with initial providers who use meets/groups as a client
          acquisition channel.
        </strong>{" "}
        This solves both sides simultaneously:
      </p>
      <ol>
        <li>
          <strong>Providers get a new acquisition tool.</strong> Running
          or co-hosting meets lets them meet potential clients in a
          natural, non-salesy context. Dog owners see the provider
          interact with dogs, observe their knowledge and manner, build
          organic familiarity. The meet IS the sales funnel.
        </li>
        <li>
          <strong>Owners get immediate value.</strong> Even before the
          marketplace has critical mass, meets and groups provide social
          value. The care layer is a bonus, not the only reason to join.
        </li>
        <li>
          <strong>Trust signals accumulate naturally.</strong> Every meet
          a provider attends or hosts generates Community Regular,
          Neighbourhood Anchor, and Trusted by Your Network badges. By
          the time an owner is ready to book, the provider&apos;s profile
          is rich with earned signals.
        </li>
      </ol>

      <h3>How it works in practice</h3>

      <p>
        <strong>Phase 1 — Recruit 3-5 seed providers.</strong> Target:
        professional dog walkers / trainers in Vinohrady, Letná, Vršovice
        who already have clients but want to grow. Pitch: &quot;Run a
        free weekly walk-and-train meet through Doggo. You&apos;ll meet
        potential clients in a natural setting, and they&apos;ll see your
        skills firsthand.&quot;
      </p>
      <p>
        What providers get: a structured way to host events (built), exposure
        to dog owners who don&apos;t know them, trust badges that accumulate,
        a booking pipeline that converts community members into paying clients,
        and a profile that acts as a portfolio (posts, reviews, badges,
        connections).
      </p>
      <p>
        What Doggo gets: real content in the platform (meets, groups, posts),
        providers with legitimate credentials and trust signals, a live test
        of the community → trust → care funnel, and word-of-mouth from
        owners who discover providers through meets.
      </p>

      <p>
        <strong>Phase 2 — Providers host meets, owners join.</strong> A
        provider runs a weekly &quot;Morning Walk &amp; Basic Training&quot;
        meet at Letná park. 8–10 dog owners show up. After the meet, the
        post-meet review flow fires. Owners mark the provider (and each
        other) as Familiar or Connected. The provider&apos;s profile
        gains Community Regular and Neighbourhood Anchor badges.
      </p>

      <p>
        <strong>Phase 3 — Organic conversion.</strong> An owner who&apos;s
        attended 3 meets with the same provider now has: Connected status,
        shared meet history, mutual connections, and has personally seen
        the provider handle dogs. They don&apos;t need platform vetting —
        they have something better.
      </p>

      <p>
        <strong>Phase 4 — Provider refers more providers.</strong> The
        seed provider tells their trainer friend: &quot;I got 4 new
        weekly clients from hosting meets on Doggo.&quot; The friend
        signs up. Network effects begin.
      </p>

      <h3>Why this works better than traditional marketplace seeding</h3>
      <ul>
        <li>
          <strong>No fake trust.</strong> Every signal is real — earned
          through actual community participation.
        </li>
        <li>
          <strong>Providers are motivated.</strong> Meets are directly
          useful to them, not busy-work to populate a platform.
        </li>
        <li>
          <strong>Owners get value before they need care.</strong> Social
          meets have standalone value. The care marketplace is a natural
          extension, not a forced conversion.
        </li>
        <li>
          <strong>It tests the thesis.</strong> If providers can&apos;t
          convert meet attendees into clients, that&apos;s important to
          know before scaling.
        </li>
      </ul>

      <h3>Risks</h3>
      <ul>
        <li>
          <strong>Provider time investment.</strong> Running weekly meets
          is real work. Need to ensure ROI is there within 4–6 weeks.
        </li>
        <li>
          <strong>Provider-as-host bias.</strong> If every meet is hosted
          by a provider, it could feel like a sales event. Mix in
          owner-hosted and park-group meets to keep it organic.
        </li>
        <li>
          <strong>Small market test.</strong> 3–5 providers in 3
          neighbourhoods is enough to validate the loop, not enough for a
          real marketplace. This is about validating the funnel, not
          scaling it.
        </li>
      </ul>

      <h2>How everything feeds together</h2>

      <blockquote>
        <p>
          <strong>Prague providers already build trust through</strong>
          {" "}credentials, experience, daily updates, testimonials, and
          word-of-mouth. Doggo captures and displays these as credential
          badges (self-declared) plus community-earned badges (platform
          data). The cold-start seeding generates those community badges
          organically: providers host meets → attend events → build
          connections → earn trust signals. Owners see rich profiles
          combining &quot;Certified trainer,&quot; &quot;Known by 8
          people in your area,&quot; and &quot;3 of your connections
          use them.&quot; The trust gap is bridged. Booking happens —
          whether via the organic path (attended meets together) or the
          direct path (discovered in search, with strong signals).
        </p>
      </blockquote>

      <h2>Action items</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Priority</th>
            <th>Target phase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Design badge system for provider profiles</strong>
              Community + credential + platform, display on cards and profiles.
            </td>
            <td>High</td>
            <td>Discover &amp; Care</td>
          </tr>
          <tr>
            <td>
              <strong>Add credential fields to provider profile data</strong>
              Certifications, years, methodology, first aid.
            </td>
            <td>High</td>
            <td>Discover &amp; Care</td>
          </tr>
          <tr>
            <td>
              <strong>Design &quot;Trusted by your network&quot; signal</strong>
              Show which connections use this provider.
            </td>
            <td>High</td>
            <td>Discover &amp; Care</td>
          </tr>
          <tr>
            <td>
              <strong>Write cold-start seeding plan</strong>
              3–5 providers, 3 neighbourhoods, weekly meets, 8-week test.
            </td>
            <td>High</td>
            <td>Pre-launch / GTM</td>
          </tr>
          <tr>
            <td>
              <strong>Add &quot;Repeat clients&quot; metric to provider data</strong>
              Track and display rebooking rate.
            </td>
            <td>Medium</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Design Intro Session booking type</strong>
              Free/reduced first session for Discover-path providers.
            </td>
            <td>Medium</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Auto-calculated Responsive/Consistent badges</strong>
              Requires real messaging and session data.
            </td>
            <td>Low</td>
            <td>Post-prototype</td>
          </tr>
        </tbody>
      </table>

      <h2>References</h2>
      <ul>
        <li>
          <a
            href="https://rockyandskipper.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rocky &amp; Skipper — Prague dog training &amp; care
          </a>
        </li>
        <li>
          <a
            href="https://pawz.cz/en/about/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pawz — Prague dog walking &amp; sitting
          </a>
        </li>
        <li>
          <a
            href="https://www.hlidacky.cz/en/pet-sitters/1-praha"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hlídačky.cz — Prague pet sitter marketplace
          </a>
        </li>
        <li>
          <a
            href="https://www.expats.cz/directory/listing/dogitory-qivnq"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dogitory — Prague dog sitting &amp; training
          </a>
        </li>
        <li>
          <a
            href="https://www.narodnikvalifikace.cz/en-us/qualification-1373-Dog_trainer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Czech National Vocational Qualification — Dog Trainer
          </a>
        </li>
        <li>
          <a
            href="https://www.expats.cz/directory/family-and-pets/dog-walkers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Expats.cz — Dog walkers in Prague
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/groups/946656263360862/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook — Pet sitting, dog walking Prague group
          </a>
        </li>
        <li>
          <a
            href="https://www.petbacker.com/s/dog-walking/prague--czech-republic"
            target="_blank"
            rel="noopener noreferrer"
          >
            PetBacker — Prague dog walking
          </a>
        </li>
      </ul>
    </>
  );
}
