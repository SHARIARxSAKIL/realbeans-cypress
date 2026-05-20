const STORE_PASSWORD = 'nahbow'

const parsePrice = (priceText) => {
  const normalizedPrice = priceText
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.')

  return Number.parseFloat(normalizedPrice)
}

describe('RealBeans Shopify Store', () => {
  const enterPassword = () => {
    cy.visit('/')
    cy.get('input[type="password"]').type(STORE_PASSWORD)
    cy.get('button[type="submit"]').click()
  }

  // TEST 1 - Password bypass
  it('should bypass the password page', () => {
    enterPassword()
    cy.url().should('not.include', 'password')
  })

  // TEST 2 - Homepage intro text
  it('should show the intro text on the homepage', () => {
    enterPassword()
    cy.contains('Since 1801, RealBeans has roasted premium coffee').should('be.visible')
  })

  // TEST 3 - Product catalog shows correct items
  it('should show both products in the catalog', () => {
    enterPassword()
    cy.visit('/collections/all')
    cy.contains('Roasted coffee beans 5kg').should('be.visible')
    cy.contains('Blended coffee 5kg').should('be.visible')
  })

  // TEST 4 - Sorting by price changes order
  it('should sort products by price low to high', () => {
    enterPassword()
    cy.visit('/collections/all?sort_by=price-ascending')
    cy.location('search').should('include', 'sort_by=price-ascending')

    cy.get('main .price:visible').first().invoke('text').then((firstPrice) => {
      cy.get('main .price:visible').last().invoke('text').then((lastPrice) => {
        const first = parsePrice(firstPrice)
        const last = parsePrice(lastPrice)

        expect(first).to.be.lte(last)
      })
    })
  })

  // TEST 5 - Product detail page (Roasted beans)
  it('should show correct details on the Roasted coffee beans product page', () => {
    enterPassword()
    cy.visit('/products/roasted-coffee-beans-5kg')
    cy.contains('Our best and sustainable real roasted beans.').should('be.visible')
    cy.get('main').contains('.price:visible', /\u20ac\s*40/).should('be.visible')
    cy.get('img[src*="RealBeansRoastedBag"]').should('exist')
  })

  // TEST 6 - Product detail page (Blended coffee)
  it('should show correct details on the Blended coffee product page', () => {
    enterPassword()
    cy.visit('/products/blended-coffee-5kg')
    cy.contains('RealBeans coffee, ready to brew.').should('be.visible')
    cy.get('main').contains('.price:visible', /\u20ac\s*55/).should('be.visible')
    cy.get('img[src*="RealBeansBlendBag"]').should('exist')
  })

  // TEST 7 - About page
  it('should show the history paragraph on the About page', () => {
    enterPassword()
    cy.visit('/pages/about')
    cy.contains('From a small Antwerp grocery to a European coffee staple').should('be.visible')
  })
})
