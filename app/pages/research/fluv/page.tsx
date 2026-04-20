export default function FluvResearchPage() {
  return (
    <>
      <header>
        <p className="research-eyebrow">Competitive Research</p>
        <h1>Fluv</h1>
        <p>
          A vetted pet-care marketplace operating across Taiwan, Japan and
          Hong Kong. The closest thing to a direct competitor we&apos;ve seen
          — different enough not to be a threat, similar enough to learn from.
        </p>
        <div className="research-meta">
          <span className="research-meta-tag">Marketplace</span>
          <span className="research-meta-tag">Trust via vetting</span>
          <span className="research-meta-tag">~190K users · 9K sitters</span>
        </div>
      </header>

      <h2>What Fluv is</h2>
      <p>
        &quot;Airbnb for pets.&quot; Founded by Candace Chen in Taiwan;
        Forbes Asia 30 Under 30. Eight-person remote team, Appworks
        accelerator. Revenue model is marketplace commission — drop-in
        sitting runs around NT$400/visit (~$12 USD), meaningfully cheaper
        than traditional pet hotels. Semi-annual revenue grew from $22K to
        $100K+ in one year (2022), expected to triple in 2023.
      </p>
      <p>
        <strong>Core thesis:</strong> urban professionals need secure,
        reliable care for their pets. Trust is the critical barrier. Fluv
        solves trust through vetting, not community.
      </p>

      <h2>How Fluv builds trust</h2>
      <p>
        Top-down vetting, stacked. Sitters pass screening tests and
        training videos. ID verification, criminal record check, and
        (in Japan) Japan Pet Sitter Association certification. Professional
        photography of sitters and their homes, borrowed directly from
        Airbnb&apos;s playbook. Platform-backed insurance (Cathay Insurance,
        up to 2M in claims) and a 3-day compensation window. A free
        pre-booking meet-and-greet at the owner&apos;s home. 100% verified
        reviews from other pet owners.
      </p>
      <p>
        The net effect: a new user can book a stranger with high confidence
        from day one. That&apos;s the key difference from Doggo&apos;s
        community-first approach, where trust emerges from real-world
        interactions over time. Fluv&apos;s approach scales faster; Doggo&apos;s
        creates a more durable moat.
      </p>

      <h2>Features worth studying</h2>

      <h3>Data-driven matching</h3>
      <p>
        Fluv matches owners to sitters using pet data — species, breed,
        size, temperament, special needs like medication or anxiety. A
        nervous rescue needs a different walker than a high-energy lab.
        Doggo already has this pet-profile data on file. A
        &quot;recommended for [dog name]&quot; layer on Discover &gt; Dog
        Care would be a meaningful step up from filtering on service type
        + location.
      </p>

      <h3>Pre-booking meet-and-greet</h3>
      <p>
        Fluv offers a free in-home consultation before the first booking.
        The sitter visits, meets the pet, learns routines and quirks. No
        commitment. This is exactly what Doggo&apos;s community meets do
        organically — but only for people who&apos;ve been to meets. For
        the direct-discovery path (someone finds a provider in Discover
        without prior meets), a structured &quot;Intro Session&quot;
        booking type could bridge the trust gap.
      </p>

      <h3>Professional sitter photography</h3>
      <p>
        Borrowed from Airbnb: professional photos of sitters and their
        spaces dramatically increase booking confidence. Signals &quot;this
        person is legitimate and the platform takes quality
        seriously.&quot; Doggo&apos;s providers emerge organically from
        the community, so we won&apos;t have professional shoots — but
        Mock World Building should ensure every generated provider image
        feels warm and professional, and a gentle nudge to upload a good
        photo when enabling provider mode is worth the build.
      </p>

      <h3>Insurance and guarantees</h3>
      <p>
        Fluv includes platform-backed insurance (up to 2M claims) and a
        3-day satisfaction guarantee. Removes financial risk from the
        owner&apos;s decision. Not relevant for the prototype, but any
        production care marketplace needs to answer &quot;what happens if
        something goes wrong?&quot; Doggo&apos;s community trust model
        reduces incidents but doesn&apos;t eliminate them — insurance and
        a clear dispute resolution process will be table stakes.
      </p>

      <h3>Social mission as growth lever</h3>
      <p>
        Fluv&apos;s mission to create 100K jobs for &quot;pet-loving
        displaced women in Asia&quot; is both genuine impact and a smart
        growth narrative. Many of their 9,000 sitters are housewives
        seeking flexible income. The mission attracts press (Forbes, CES)
        and sitters simultaneously. Doggo&apos;s equivalent framing
        — &quot;turn your love for dogs into flexible income&quot; — is
        warmer and more compelling than &quot;become a provider.&quot;
      </p>

      <h2>What Fluv gets wrong (or doesn&apos;t do)</h2>
      <ul>
        <li>
          <strong>No community layer.</strong> Transactional: find sitter
          → book → done. No meets, no groups, no social graph. Owners
          don&apos;t know each other. Sitters don&apos;t know each other.
          No neighbourhood identity.
        </li>
        <li>
          <strong>No trust progression.</strong> You either trust the
          platform&apos;s vetting or you don&apos;t. There&apos;s no way
          to deepen a relationship over time within the product.
        </li>
        <li>
          <strong>No peer care.</strong> Every provider is a gig worker.
          There&apos;s no concept of &quot;my neighbour watches my dog
          sometimes&quot; — the informal care that makes up most real
          pet care.
        </li>
        <li>
          <strong>Platform dependency.</strong> Fluv IS the trust. If the
          platform disappears, so does every trust signal. Doggo&apos;s
          community-built trust persists in real relationships.
        </li>
      </ul>

      <h2>Strategic takeaways for Doggo</h2>

      <h3>Validates the thesis</h3>
      <p>
        Fluv proves trust is the core problem in pet care — their entire
        pitch is &quot;vetted, reliable, safe.&quot; Doggo solves the same
        problem through a fundamentally harder and more defensible
        mechanism: real relationships. Fluv&apos;s approach scales faster
        (vetting is a process, community is organic) but Doggo&apos;s
        approach creates a moat (you can&apos;t replicate someone&apos;s
        neighbourhood dog community).
      </p>

      <h3>The hybrid trust question</h3>
      <p>
        The biggest takeaway:{" "}
        <strong>
          Doggo should consider lightweight trust signals that work even
          before deep community ties form.
        </strong>{" "}
        Fluv shows that users want some confidence before committing.
        Candidates:
      </p>
      <ul>
        <li>Verified identity badge (not full background check, just ID confirmation)</li>
        <li>&quot;X people in your network use this provider&quot; signal</li>
        <li>Number of meets attended / community participation score</li>
        <li>Reviews from connected users weighted higher than strangers</li>
        <li>Optional intro session before first recurring booking</li>
      </ul>
      <p>
        These don&apos;t replace community trust — they complement it for
        users who haven&apos;t built deep connections yet.
      </p>

      <h3>The &quot;Airbnb for pets&quot; framing</h3>
      <p>
        Fluv&apos;s positioning is clear and immediately understood. Doggo&apos;s
        is harder to explain: &quot;a community for dog owners that also
        enables care.&quot; The demo narrative needs to make the community
        → trust → care funnel feel as obvious as &quot;find a vetted
        sitter.&quot;
      </p>

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
              <strong>Explore &quot;intro session&quot; booking type</strong>
              Free/reduced first session with a new provider.
            </td>
            <td>High</td>
            <td>Bookings Deep Pass</td>
          </tr>
          <tr>
            <td>
              <strong>Design lightweight trust signals for provider cards</strong>
              Shared connections, meets attended, verified badge concept.
            </td>
            <td>High</td>
            <td>Discover &amp; Care</td>
          </tr>
          <tr>
            <td>
              <strong>Pet-profile-based provider matching</strong>
              Recommend by breed, size, temperament, special needs.
            </td>
            <td>Medium</td>
            <td>Discover &amp; Care</td>
          </tr>
          <tr>
            <td>
              <strong>Refine provider onboarding narrative</strong>
              &quot;Turn your love for dogs into flexible income.&quot;
            </td>
            <td>Medium</td>
            <td>Landing / Demo</td>
          </tr>
          <tr>
            <td>
              <strong>Review provider profile photo quality for demo</strong>
              Warm and professional generated images.
            </td>
            <td>Low</td>
            <td>Mock World Building</td>
          </tr>
        </tbody>
      </table>

      <h2>References</h2>
      <ul>
        <li>
          <a
            href="https://fluv-2308f7.webflow.io/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fluv homepage (Japan)
          </a>
        </li>
        <li>
          <a
            href="https://fluv-2308f7.webflow.io/en/service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fluv services
          </a>
        </li>
        <li>
          <a
            href="https://taiwannews.com.tw/news/4995578"
            target="_blank"
            rel="noopener noreferrer"
          >
            Taiwan News: Fluv pet-sitting gig economy (2023)
          </a>
        </li>
        <li>
          <a
            href="https://www.taiwannews.com.tw/news/6100853"
            target="_blank"
            rel="noopener noreferrer"
          >
            Taiwan News: Fluv drives shift in pet care (2025)
          </a>
        </li>
        <li>
          <a
            href="https://www.digitimes.com/news/a20220107VL200/ces-2022.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            CES 2022: Fluv uses pet data
          </a>
        </li>
        <li>
          <a
            href="https://kobestartuphub.com/s/fluv"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kobe Startup Hub: Fluv profile
          </a>
        </li>
        <li>
          <a
            href="https://www.fluv.com/tw/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fluv Taiwan site
          </a>
        </li>
      </ul>
    </>
  );
}
